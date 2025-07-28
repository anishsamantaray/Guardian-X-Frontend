variable "aws_region" {
  description = "AWS region (e.g. ap-south-1)"
  type        = string
}

variable "bucket_name" {
  description = "Unique S3 bucket name for your static site"
  type        = string
}