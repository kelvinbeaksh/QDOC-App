variable "environment" {
  default     = "staging"
  description = "Environment tag for resource group"
}

variable "region" {
  default = "asia-southeast1"
}

variable "project_id" {}

variable "zone" {
  default = "asia-southeast1-a"
}

variable "gcp_auth_file" {}

variable "firebase_config" {}

variable "api_base_url" {}

variable "docker_image_tag" {}
