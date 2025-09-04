terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "me" {}

resource "aws_s3_bucket" "artifacts" {
  bucket        = "${var.app_name}-artifacts-${data.aws_caller_identity.me.account_id}"
  force_destroy = true
}

resource "aws_s3_object" "app_zip" {
  bucket = aws_s3_bucket.artifacts.id
  key    = "versions/${var.version_label}.zip"
  source = var.source_bundle
  etag   = filemd5(var.source_bundle)
}

resource "aws_iam_role" "eb_ec2_role" {
  name               = "${var.app_name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.eb_ec2_assume.json
}

data "aws_iam_policy_document" "eb_ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "eb_ec2_managed" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "eb_ec2_s3" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_iam_instance_profile" "eb_ec2_instance_profile" {
  name = "${var.app_name}-instance-profile"
  role = aws_iam_role.eb_ec2_role.name
}

resource "aws_elastic_beanstalk_application" "app" {
  name        = var.app_name
  description = "Next.js Docker app deployed via Terraform/CI"
}

resource "aws_elastic_beanstalk_application_version" "ver" {
  name        = var.version_label
  application = aws_elastic_beanstalk_application.app.name
  bucket      = aws_s3_bucket.artifacts.id
  key         = aws_s3_object.app_zip.key
  lifecycle { create_before_destroy = true }
}

resource "aws_elastic_beanstalk_environment" "env" {
  name                = "${var.app_name}-${var.env_name}"
  application         = aws_elastic_beanstalk_application.app.name
  platform_arn        = var.platform_arn
  version_label       = aws_elastic_beanstalk_application_version.ver.name
  solution_stack_name = null

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_ec2_instance_profile.name
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "HealthCheckPath"
    value     = "/"
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "2"
  }
}
