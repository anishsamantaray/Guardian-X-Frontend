terraform {
  required_version = ">= 1.2"

  backend "s3" {
    # overridden in CI via `-backend-config`
    bucket  = "YOUR_STATE_BUCKET"
    key     = "nextjs-static-site/terraform.tfstate"
    region  = "ap-south-1"
    encrypt = true
  }
}