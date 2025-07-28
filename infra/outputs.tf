output "bucket_name" {
  description = "S3 bucket serving the site"
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_domain" {
  description = "Your CloudFront URL (use this to browse)"
  value       = aws_cloudfront_distribution.cdn.domain_name
}