terraform {
  backend "s3" {
    bucket         = "guardianx-frontend-state"
    key            = "guardianx-frontend/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "guardianx_frontend_terraform_Locks"
  }
}