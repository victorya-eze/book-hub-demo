terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-victory"
    key    = "EB-app/book-review"
    region = "eu-west-2"
  }
}
