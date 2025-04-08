terraform {
  backend "gcs" {
    bucket = "qdoc_staging_portal_terraform_backend"
    prefix = "staging_tf"
    credentials = "creds/keys.json"
  }
}

provider "google" {
  project = var.project_id
  region = var.region
  zone = var.zone
  credentials = file(var.gcp_auth_file)
}

resource "google_cloud_run_service" "qdoc_portal" {
  name = "qdoc-portal-${var.environment}"
  location = var.region

  autogenerate_revision_name = true

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "1000"
        "run.googleapis.com/client-name" = "terraform"
      }
    }

    spec {
      containers {
        image = "asia.gcr.io/${var.project_id}/qdoc_portal:${var.docker_image_tag}"
        env {
          name = "REACT_APP_NODE_ENV"
          value = "production"
        }
        env {
          name = "REACT_APP_VALIDATE_FIREBASE_CONFIG"
          value = "true"
        }
        env {
          name = "REACT_APP_API_BASE_URL"
          value = var.api_base_url
        }
        env {
          name = "REACT_APP_FIREBASE_CONFIG"
          value = var.firebase_config
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.qdoc_portal.location
  project = google_cloud_run_service.qdoc_portal.project
  service = google_cloud_run_service.qdoc_portal.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
