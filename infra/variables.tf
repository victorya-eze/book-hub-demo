variable "app_name"        { type = string  default = "eb-nextjs-demo" }
variable "env_name"        { type = string  default = "dev" }
variable "region"          { type = string  default = "eu-west-2" }
variable "version_label"   { type = string  default = "v-0" }
variable "source_bundle"   { type = string  default = "../app.zip" }
variable "platform_arn" {
  type    = string
  default = "arn:aws:elasticbeanstalk:eu-west-2::platform/Docker running on 64bit Amazon Linux 2/5.10.0"
}
