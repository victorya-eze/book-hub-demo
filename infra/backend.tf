terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-victory"
    key    = "EB-app/book-review"
    region = "eu-west-2"
  }
}

# Get the most recent "64bit Amazon Linux 2 ... running Docker" solution stack in this region
data "aws_elastic_beanstalk_solution_stack" "docker_al2" {
  most_recent = true
  name_regex  = "^64bit Amazon Linux 2.*running Docker$"
}
