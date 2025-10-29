# terraform/main.tf
variable "site_id" {}
variable "subdomain" {}

resource "aws_s3_bucket" "site" {
  bucket = "site-${var.site_id}"
  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}

resource "aws_cloudfront_distribution" "site" {
  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "S3-${var.site_id}"
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = ["${var.subdomain}.landing.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.site_id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.landing.arn
    ssl_support_method  = "sni-only"
  }
}
