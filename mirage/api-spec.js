/* eslint-disable */
export default {
  "@type": "home",
  "@href": "/v3/",
  "config": {
    "host": "travis-ci.com",
    "github": {
      "api_url": "https://api.github.com",
      "web_url": "https://github.com",
      "scopes": [
        "user:email",
        "repo",
        "read:org"
      ]
    },
    "pusher": {
      "key": "59236bc0716a551eab40",
      "private": true
    }
  },
  "errors": {
    "admin_access_required": {
      "status": 403,
      "default_message": "admin access to this repo required",
      "additional_attributes": [

      ]
    },
    "already_syncing": {
      "status": 409,
      "default_message": "sync already in progress",
      "additional_attributes": [

      ]
    },
    "build_already_running": {
      "status": 409,
      "default_message": "build already running, cannot restart",
      "additional_attributes": [

      ]
    },
    "build_not_cancelable": {
      "status": 409,
      "default_message": "build is not running, cannot cancel",
      "additional_attributes": [

      ]
    },
    "client_error": {
      "status": 400,
      "default_message": "bad request",
      "additional_attributes": [

      ]
    },
    "duplicate_resource": {
      "status": 409,
      "default_message": "resource already exists",
      "additional_attributes": [

      ]
    },
    "insufficient_access": {
      "status": 403,
      "default_message": "forbidden",
      "additional_attributes": [
        "permission",
        "resource_type"
      ]
    },
    "job_already_running": {
      "status": 409,
      "default_message": "job already running, cannot restart",
      "additional_attributes": [

      ]
    },
    "job_not_cancelable": {
      "status": 409,
      "default_message": "job is not running, cannot cancel",
      "additional_attributes": [

      ]
    },
    "job_unfinished": {
      "status": 409,
      "default_message": "job still running, cannot remove log yet",
      "additional_attributes": [

      ]
    },
    "log_already_removed": {
      "status": 409,
      "default_message": "log has already been removed",
      "additional_attributes": [

      ]
    },
    "login_required": {
      "status": 403,
      "default_message": "login required",
      "additional_attributes": [

      ]
    },
    "method_not_allowed": {
      "status": 405,
      "default_message": "method not allowed",
      "additional_attributes": [

      ]
    },
    "not_found": {
      "status": 404,
      "default_message": "resource not found (or insufficient access)",
      "additional_attributes": [
        "resource_type"
      ]
    },
    "not_implemented": {
      "status": 501,
      "default_message": "request not (yet) implemented",
      "additional_attributes": [

      ]
    },
    "private_repo_feature": {
      "status": 403,
      "default_message": "this feature is only available on private repositories and for Travis CI Enterprise customers",
      "additional_attributes": [

      ]
    },
    "repository_inactive": {
      "status": 406,
      "default_message": "cannot create requests on an inactive repository",
      "additional_attributes": [

      ]
    },
    "request_limit_reached": {
      "status": 429,
      "default_message": "request limit reached for resource",
      "additional_attributes": [

      ]
    },
    "server_error": {
      "status": 500,
      "default_message": "internal server error",
      "additional_attributes": [

      ]
    },
    "source_unknown": {
      "status": 400,
      "default_message": "source unknown",
      "additional_attributes": [

      ]
    },
    "unprocessable_entity": {
      "status": 422,
      "default_message": "request unable to be processed due to semantic errors",
      "additional_attributes": [

      ]
    },
    "wrong_credentials": {
      "status": 403,
      "default_message": "access denied",
      "additional_attributes": [

      ]
    },
    "wrong_params": {
      "status": 400,
      "default_message": "wrong parameters",
      "additional_attributes": [

      ]
    }
  },
  "resources": {
    "active": {
      "@type": "resource",
      "actions": {
        "for_owner": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{owner.login}/active{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{user.login}/active{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{organization.login}/active{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/github_id/{owner.github_id}/active{?include}"
          }
        ]
      },
      "attributes": [
        "builds"
      ],
      "representations": {
        "standard": [
          "builds"
        ]
      }
    },
    "beta_feature": {
      "@type": "resource",
      "actions": {
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/user/{user.id}/beta_feature/{beta_feature.id}",
            "accepted_params": [
              "beta_feature.id",
              "beta_feature.enabled"
            ]
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/user/{user.id}/beta_feature/{beta_feature.id}"
          }
        ]
      },
      "attributes": [
        "id",
        "name",
        "description",
        "enabled",
        "feedback_url"
      ],
      "representations": {
        "standard": [
          "id",
          "name",
          "description",
          "enabled",
          "feedback_url"
        ]
      }
    },
    "beta_features": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/user/{user.id}/beta_features{?include}"
          }
        ]
      },
      "attributes": [
        "beta_features"
      ],
      "representations": {
        "standard": [
          "beta_features"
        ]
      }
    },
    "beta-migration-request": {
      "@type": "resource",
      "actions": {
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/user/{user.id}/beta_migration_request"
          }
        ]
      },
      "attributes": [
        "id",
        "owner_id",
        "owner_type",
        "owner_name",
        "organizations",
        "accepted_at"
      ],
      "representations": {
        "standard": [
          "id",
          "owner_id",
          "owner_type",
          "owner_name",
          "organizations",
          "accepted_at"
        ]
      }
    },
    "beta-migration-requests": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/user/{user.id}/beta_migration_requests"
          }
        ]
      },
      "attributes": [
        "id",
        "owner_id",
        "owner_type",
        "owner_name",
        "organizations",
        "accepted_at"
      ],
      "representations": {
        "standard": [
          "id",
          "owner_id",
          "owner_type",
          "owner_name",
          "organizations",
          "accepted_at"
        ]
      }
    },
    // Why is this and `credit-card-info` dashed and not underscored? 🤔
    "billing-info": {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "address", "address2", "billing_email", "city", "company", "country", "first_name", "last_name", "state", "vat_id", "zip_code"],
      "representations":  {
        "standard":       ["id", "address", "address2", "billing_email", "city", "company", "country", "first_name", "last_name", "state", "vat_id", "zip_code"],
        "minimal":       ["id", "address", "address2", "billing_email", "city", "company", "country", "first_name", "last_name", "state", "vat_id", "zip_code"],
      }
    },
    "branch": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/branch/{branch.name}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/branch/{branch.name}{?include}"
          }
        ]
      },
      "attributes": [
        "name",
        "repository",
        "default_branch",
        "exists_on_github",
        "last_build",
        "recent_builds"
      ],
      "representations": {
        "minimal": [
          "name"
        ],
        "standard": [
          "name",
          "repository",
          "default_branch",
          "exists_on_github",
          "last_build"
        ],
        "additional": [
          "recent_builds"
        ]
      }
    },
    "branches": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/branches{?branch.exists_on_github,exists_on_github,include,limit,offset,sort_by}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/branches{?branch.exists_on_github,exists_on_github,include,limit,offset,sort_by}"
          }
        ]
      },
      "attributes": [
        "branches"
      ],
      "representations": {
        "standard": [
          "branches"
        ]
      },
      "sortable_by": [
        "name",
        "last_build",
        "exists_on_github",
        "default_branch"
      ],
      "default_sort": "default_branch,exists_on_github,last_build:desc"
    },
    "broadcast": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "id",
        "message",
        "created_at",
        "category",
        "active",
        "recipient"
      ],
      "representations": {
        "minimal": [
          "id",
          "message",
          "created_at",
          "category",
          "active"
        ],
        "standard": [
          "id",
          "id",
          "message",
          "created_at",
          "category",
          "active",
          "recipient"
        ]
      }
    },
    "broadcasts": {
      "@type": "resource",
      "actions": {
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/broadcasts{?active,broadcast.active,include}"
          }
        ]
      },
      "attributes": [
        "broadcasts"
      ],
      "representations": {
        "standard": [
          "broadcasts"
        ]
      }
    },
    "build": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/build/{build.id}{?include}"
          }
        ],
        "cancel": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/build/{build.id}/cancel",
            "accepted_params": [

            ]
          }
        ],
        "restart": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/build/{build.id}/restart",
            "accepted_params": [

            ]
          }
        ],
        "increasePriority": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/build/{build.id}/priority?cancel_all",
            "accepted_params": [

            ]
          }
        ]
      },
      "attributes": [
        "id",
        "number",
        "state",
        "duration",
        "event_type",
        "previous_state",
        "pull_request_title",
        "pull_request_number",
        "started_at",
        "finished_at",
        "private",
        "repository",
        "branch",
        "tag",
        "commit",
        "jobs",
        "stages",
        "created_by",
        "updated_at",
        "request",
        "yaml",
        "priority"
      ],
      "representations": {
        "minimal": [
          "id",
          "number",
          "state",
          "duration",
          "event_type",
          "previous_state",
          "pull_request_title",
          "pull_request_number",
          "started_at",
          "finished_at",
          "private"
        ],
        "standard": [
          "id",
          "number",
          "state",
          "duration",
          "event_type",
          "previous_state",
          "pull_request_title",
          "pull_request_number",
          "started_at",
          "finished_at",
          "private",
          "repository",
          "branch",
          "tag",
          "commit",
          "jobs",
          "stages",
          "created_by",
          "updated_at",
          "yaml",
          "priority"
        ]
      },
      "permissions": [
        "read",
        "cancel",
        "restart",
        "prioritize"
      ]
    },
    "builds": {
      "@type": "resource",
      "actions": {
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/builds{?include,limit,limit,offset,offset,sort_by,sort_by}"
          }
        ],
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/builds{?branch.name,build.created_by,build.event_type,build.previous_state,build.state,created_by,event_type,include,limit,offset,previous_state,sort_by,state}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/builds{?branch.name,build.created_by,build.event_type,build.previous_state,build.state,created_by,event_type,include,limit,offset,previous_state,sort_by,state}"
          }
        ]
      },
      "attributes": [
        "builds"
      ],
      "representations": {
        "standard": [
          "builds"
        ]
      },
      "sortable_by": [
        "id",
        "started_at",
        "finished_at"
      ]
    },
    "caches": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/caches{?branch,caches.branch,caches.match,include,match}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/caches{?branch,caches.branch,caches.match,include,match}"
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.id}/caches"
          },
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.slug}/caches"
          }
        ]
      },
      "attributes": [
        "branch",
        "match"
      ],
      "representations": {
        "standard": [
          "branch",
          "match"
        ]
      }
    },
    "commit": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "id",
        "sha",
        "ref",
        "message",
        "compare_url",
        "committed_at",
        "committer",
        "author"
      ],
      "representations": {
        "minimal": [
          "id",
          "sha",
          "ref",
          "message",
          "compare_url",
          "committed_at"
        ],
        "standard": [
          "id",
          "sha",
          "ref",
          "message",
          "compare_url",
          "committed_at",
          "committer",
          "author"
        ]
      }
    },
    "credit-card-info":            {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "card_owner", "expiration_date", "last_digits"],
      "representations":  {
        "standard":       ["id", "card_owner", "expiration_date", "last_digits"],
        "minimal":        ["id", "card_owner", "expiration_date", "last_digits"],
      }
    },
    "discount":                    {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "name", "percent_off", "amount_off", "valid", "duration", "duration_in_months"],
      "representations":  {
        "standard":       ["id", "name", "percent_off", "amount_off", "valid", "duration", "duration_in_months"],
        "minimal":        ["id", "name", "percent_off", "amount_off", "valid", "duration", "duration_in_months"],
      }
    },
    "cron": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/cron/{cron.id}{?include}"
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/cron/{cron.id}"
          }
        ],
        "for_branch": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/branch/{branch.name}/cron{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/branch/{branch.name}/cron{?include}"
          }
        ],
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/branch/{branch.name}/cron",
            "accepted_params": [
              "cron.interval",
              "cron.dont_run_if_recent_build_exists",
              "cron.interval",
              "cron.dont_run_if_recent_build_exists"
            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/branch/{branch.name}/cron",
            "accepted_params": [
              "cron.interval",
              "cron.dont_run_if_recent_build_exists",
              "cron.interval",
              "cron.dont_run_if_recent_build_exists"
            ]
          }
        ]
      },
      "attributes": [
        "id",
        "repository",
        "branch",
        "interval",
        "dont_run_if_recent_build_exists",
        "last_run",
        "next_run",
        "created_at",
        "active"
      ],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "repository",
          "branch",
          "interval",
          "dont_run_if_recent_build_exists",
          "last_run",
          "next_run",
          "created_at",
          "active"
        ]
      },
      "permissions": [
        "read",
        "start",
        "delete"
      ]
    },
    "crons": {
      "@type": "resource",
      "actions": {
        "for_repository": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/crons{?include,limit,offset}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/crons{?include,limit,offset}"
          }
        ]
      },
      "attributes": [
        "crons"
      ],
      "representations": {
        "standard": [
          "crons"
        ]
      }
    },
    "email_subscription": {
      "@type": "resource",
      "actions": {
        "unsubscribe": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.id}/email_subscription"
          },
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.slug}/email_subscription"
          }
        ],
        "resubscribe": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/email_subscription",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/email_subscription",
            "accepted_params": [

            ]
          }
        ]
      }
    },
    "env_var": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/env_var/{env_var.id}{?env_var.id,id,id,include,repository.id}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/env_var/{env_var.id}{?env_var.id,id,id,include,repository.id}"
          }
        ],
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.id}/env_var/{env_var.id}",
            "accepted_params": [
              "env_var.name",
              "env_var.value",
              "env_var.public"
            ]
          },
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.slug}/env_var/{env_var.id}",
            "accepted_params": [
              "env_var.name",
              "env_var.value",
              "env_var.public"
            ]
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.id}/env_var/{env_var.id}"
          },
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.slug}/env_var/{env_var.id}"
          }
        ]
      },
      "attributes": [
        "id",
        "name",
        "value",
        "public"
      ],
      "representations": {
        "standard": [
          "id",
          "name",
          "value",
          "public"
        ],
        "minimal": [
          "id",
          "name",
          "public"
        ]
      },
      "permissions": [
        "read",
        "write"
      ]
    },
    "env_vars": {
      "@type": "resource",
      "actions": {
        "for_repository": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/env_vars{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/env_vars{?include}"
          }
        ],
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/env_vars",
            "accepted_params": [
              "env_var.name",
              "env_var.value",
              "env_var.public"
            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/env_vars",
            "accepted_params": [
              "env_var.name",
              "env_var.value",
              "env_var.public"
            ]
          }
        ]
      },
      "attributes": [
        "env_vars"
      ],
      "representations": {
        "standard": [
          "env_vars"
        ]
      }
    },
    "error": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "error_type",
        "error_message",
        "resource_type",
        "permission"
      ]
    },
    "home": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/"
          }
        ]
      },
      "attributes": [
        "config",
        "errors",
        "resources"
      ]
    },
    "installation": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/installation/{installation.github_id}{?include}"
          }
        ]
      },
      "attributes": [
        "id",
        "github_id",
        "owner"
      ],
      "representations": {
        "minimal": [
          "id",
          "github_id"
        ],
        "standard": [
          "id",
          "github_id",
          "owner"
        ]
      }
    },
    "invoice":            {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "created_at", "status", "url", "amount_due"],
      "representations":  {
        "standard":       ["id", "created_at", "status", "url", "amount_due"],
        "minimal":        ["id", "created_at", "status", "url", "amount_due"],
      }
    },
    "invoices": {
      "@type": "resource",
      "attributes":       ["id", "created_at", "status", "url", "amount_due"],
      "representations":  {
        "standard":       ["id", "created_at", "status", "url", "amount_due"],
        "minimal":        ["id", "created_at", "status", "url", "amount_due"],
      }
    },
    "job": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/job/{job.id}{?include}"
          }
        ],
        "cancel": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/job/{job.id}/cancel",
            "accepted_params": [

            ]
          }
        ],
        "restart": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/job/{job.id}/restart",
            "accepted_params": [

            ]
          }
        ],
        "debug": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/job/{job.id}/debug",
            "accepted_params": [

            ]
          }
        ]
      },
      "attributes": [
        "id",
        "allow_failure",
        "number",
        "state",
        "started_at",
        "finished_at",
        "build",
        "queue",
        "repository",
        "commit",
        "owner",
        "stage",
        "created_at",
        "updated_at",
        "private",
        "config"
      ],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "allow_failure",
          "number",
          "state",
          "started_at",
          "finished_at",
          "build",
          "queue",
          "repository",
          "commit",
          "owner",
          "stage",
          "created_at",
          "updated_at",
          "private"
        ]
      },
      "permissions": [
        "read",
        "delete_log",
        "cancel",
        "restart",
        "debug"
      ]
    },
    "jobs": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/build/{build.id}/jobs{?include}"
          }
        ],
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/jobs{?active,created_by,include,job.active,job.created_by,job.state,limit,offset,sort_by,state}"
          }
        ]
      },
      "attributes": [
        "jobs"
      ],
      "representations": {
        "standard": [
          "jobs"
        ]
      },
      "sortable_by": [
        "id"
      ],
      "default_sort": "id:desc"
    },
    "key_pair": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/key_pair{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/key_pair{?include}"
          }
        ],
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/key_pair",
            "accepted_params": [
              "key_pair.description",
              "key_pair.value"
            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/key_pair",
            "accepted_params": [
              "key_pair.description",
              "key_pair.value"
            ]
          }
        ],
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.id}/key_pair",
            "accepted_params": [
              "key_pair.description",
              "key_pair.value"
            ]
          },
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.slug}/key_pair",
            "accepted_params": [
              "key_pair.description",
              "key_pair.value"
            ]
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.id}/key_pair"
          },
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/repo/{repository.slug}/key_pair"
          }
        ]
      },
      "attributes": [
        "description",
        "public_key",
        "fingerprint",
        "value"
      ],
      "representations": {
        "standard": [
          "description",
          "public_key",
          "fingerprint"
        ],
        "minimal": [
          "description",
          "public_key",
          "fingerprint"
        ]
      },
      "permissions": [
        "read",
        "write"
      ]
    },
    "key_pair_generated": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/key_pair/generated{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/key_pair/generated{?include}"
          }
        ],
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/key_pair/generated",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/key_pair/generated",
            "accepted_params": [

            ]
          }
        ]
      },
      "attributes": [
        "description",
        "public_key",
        "fingerprint"
      ],
      "representations": {
        "standard": [
          "description",
          "public_key",
          "fingerprint"
        ],
        "minimal": [
          "description",
          "public_key",
          "fingerprint"
        ]
      }
    },
    "lint": {
      "@type": "resource",
      "actions": {
        "lint": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/lint",
            "accepted_params": [

            ]
          }
        ]
      },
      "attributes": [
        "warnings"
      ]
    },
    "log": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/job/{job.id}/log{?include,log.token}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/job/{job.id}/log.txt{?include,log.token}"
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/job/{job.id}/log"
          }
        ]
      },
      "attributes": [
        "id",
        "content",
        "log_parts"
      ],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "content",
          "log_parts"
        ]
      },
      "permissions": [
        "read",
        "delete_log",
        "cancel",
        "restart",
        "debug"
      ]
    },
    "message": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "id",
        "level",
        "key",
        "code",
        "args",
        "src",
        "line"
      ],
      "representations": {
        "standard": [
          "id",
          "level",
          "key",
          "code",
          "args",
          "src",
          "line"
        ]
      }
    },
    "messages": {
      "@type": "resource",
      "actions": {
        "for_request": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/request/{request.id}/messages{?include,limit,offset}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/request/{request.id}/messages{?include,limit,offset}"
          }
        ]
      },
      "attributes": [
        "messages"
      ],
      "representations": {
        "standard": [
          "messages"
        ]
      }
    },
    "organization": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/org/{organization.id}{?include}"
          }
        ]
      },
      "attributes": [
        "id",
        "login",
        "name",
        "github_id",
        "avatar_url",
        "education",
        "allow_migration",
        "repositories",
        "installation"
      ],
      "representations": {
        "minimal": [
          "id",
          "login"
        ],
        "standard": [
          "id",
          "login",
          "name",
          "github_id",
          "avatar_url",
          "education",
          "allow_migration"
        ],
        "additional": [
          "repositories",
          "installation"
        ]
      },
      "permissions": [
        "read",
        "sync"
      ]
    },
    "organizations": {
      "@type": "resource",
      "actions": {
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/orgs{?include,limit,offset,organization.role,role,sort_by}"
          }
        ]
      },
      "attributes": [
        "organizations"
      ],
      "representations": {
        "standard": [
          "organizations"
        ]
      },
      "sortable_by": [
        "id",
        "login",
        "name",
        "github_id"
      ]
    },
    "owner": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{owner.login}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{user.login}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{organization.login}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/github_id/{owner.github_id}{?include}"
          }
        ]
      },
      "attributes": [
        "id",
        "login",
        "name",
        "github_id",
        "avatar_url",
        "education",
        "allow_migration",
        "repositories",
        "installation"
      ],
      "representations": {
        "minimal": [
          "id",
          "login"
        ],
        "standard": [
          "id",
          "login",
          "name",
          "github_id",
          "avatar_url",
          "education",
          "allow_migration"
        ],
        "additional": [
          "repositories",
          "installation"
        ]
      }
    },
    "plan":            {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "name", "price", "currency", "builds", "annual"],
      "representations":  {
        "standard":       ["id", "name", "price", "currency", "builds", "annual"],
        "minimal":        ["id", "name", "price", "currency", "builds", "annual"],
      }
    },
    "v2-plan-config":  {
      "@type":            "resource",
      "actions":          { },
      "attributes":       ["id", "name", "private_repos", "starting_price", "starting_users", "private_credits", "public_credits", "addon_configs"],
      "representations":  {
        "standard":       ["id", "name", "private_repos", "starting_price", "starting_users", "private_credits", "public_credits", "addon_configs"],
        "minimal":        ["id", "name", "private_repos", "starting_price", "starting_users", "private_credits", "public_credits", "addon_configs"],
      }
    },
    "preference": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/preference/{preference.name}{?include}"
          }
        ],
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/preference/{preference.name}",
            "accepted_params": [
              "preference.value"
            ]
          }
        ]
      },
      "attributes": [
        "name",
        "value"
      ],
      "representations": {
        "standard": [
          "name",
          "value"
        ],
        "minimal": [
          "name",
          "value"
        ]
      }
    },
    "preferences": {
      "@type": "resource",
      "actions": {
        "for_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/preferences{?include}"
          }
        ]
      },
      "attributes": [
        "preferences"
      ],
      "representations": {
        "standard": [
          "preferences"
        ]
      },
      "permissions": [
        "read",
        "write"
      ]
    },
    "repositories": {
      "@type": "resource",
      "actions": {
        "for_owner": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{owner.login}/repos{?active,active_on_org,include,limit,managed_by_installation,offset,private,repository.active,repository.active_on_org,repository.managed_by_installation,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{user.login}/repos{?active,active_on_org,include,limit,managed_by_installation,offset,private,repository.active,repository.active_on_org,repository.managed_by_installation,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{organization.login}/repos{?active,active_on_org,include,limit,managed_by_installation,offset,private,repository.active,repository.active_on_org,repository.managed_by_installation,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/github_id/{owner.github_id}/repos{?active,active_on_org,include,limit,managed_by_installation,offset,private,repository.active,repository.active_on_org,repository.managed_by_installation,repository.private,repository.starred,sort_by,starred}"
          }
        ],
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repos{?active,active_on_org,include,limit,managed_by_installation,offset,private,repository.active,repository.active_on_org,repository.managed_by_installation,repository.private,repository.starred,sort_by,starred}"
          }
        ]
      },
      "attributes": [
        "repositories"
      ],
      "representations": {
        "standard": [
          "repositories"
        ]
      },
      "sortable_by": [
        "id",
        "github_id",
        "owner_name",
        "name",
        "active",
        "default_branch.last_build"
      ]
    },
    "repository": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}{?include}"
          }
        ],
        "activate": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/activate",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/activate",
            "accepted_params": [

            ]
          }
        ],
        "deactivate": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/deactivate",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/deactivate",
            "accepted_params": [

            ]
          }
        ],
        "migrate": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/migrate",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/migrate",
            "accepted_params": [

            ]
          }
        ],
        "star": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/star",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/star",
            "accepted_params": [

            ]
          }
        ],
        "unstar": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/unstar",
            "accepted_params": [

            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/unstar",
            "accepted_params": [

            ]
          }
        ]
      },
      "attributes": [
        "id",
        "name",
        "vcs_name",
        "slug",
        "description",
        "github_id",
        "github_language",
        "active",
        "private",
        "owner",
        "owner_name",
        "default_branch",
        "starred",
        "managed_by_installation",
        "active_on_org",
        "migration_status",
        "current_build",
        "last_started_build",
        "next_build_number",
        "allow_migration",
        "email_subscribed",
        "build_count",
      ],
      "representations": {
        "minimal": [
          "id",
          "name",
          "slug"
        ],
        "standard": [
          "id",
          "name",
          "vcs_name",
          "slug",
          "description",
          "github_id",
          "github_language",
          "active",
          "private",
          "owner",
          "owner_name",
          "default_branch",
          "starred",
          "managed_by_installation",
          "active_on_org",
          "migration_status",
          "build_count"
        ],
        "additional": [
          "allow_migration"
        ]
      },
      "permissions": [
        "read",
        "activate",
        "deactivate",
        "migrate",
        "star",
        "unstar",
        "create_cron",
        "create_env_var",
        "create_key_pair",
        "delete_key_pair",
        "create_request",
        "admin"
      ]
    },
    "request": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/request/{request.id}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/request/{request.id}{?include}"
          }
        ]
      },
      "attributes": [
        "id",
        "state",
        "result",
        "message",
        "repository",
        "branch_name",
        "commit",
        "builds",
        "owner",
        "created_at",
        "event_type",
        "base_commit",
        "head_commit",
        "raw_configs",
        "pull_request_mergeable"
      ],
      "representations": {
        "minimal": [
          "id",
          "state",
          "result",
          "message",
          "pull_request_mergeable"
        ],
        "standard": [
          "id",
          "state",
          "result",
          "message",
          "repository",
          "branch_name",
          "commit",
          "builds",
          "owner",
          "created_at",
          "event_type",
          "base_commit",
          "head_commit",
          "raw_configs",
          "pull_request_mergeable"
        ]
      }
    },
    "requests": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/requests{?include,limit,offset}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/requests{?include,limit,offset}"
          }
        ],
        "create": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.id}/requests",
            "accepted_params": [
              "request.config",
              "request.message",
              "request.branch",
              "request.token"
            ]
          },
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/repo/{repository.slug}/requests",
            "accepted_params": [
              "request.config",
              "request.message",
              "request.branch",
              "request.token"
            ]
          }
        ]
      },
      "attributes": [
        "requests"
      ],
      "representations": {
        "standard": [
          "requests"
        ]
      }
    },
    "resource": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "actions",
        "attributes",
        "representations",
        "access_rights"
      ]
    },
    "setting": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/setting/{setting.name}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/setting/{setting.name}{?include}"
          }
        ],
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.id}/setting/{setting.name}",
            "accepted_params": [
              "setting.value"
            ]
          },
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.slug}/setting/{setting.name}",
            "accepted_params": [
              "setting.value"
            ]
          }
        ]
      },
      "attributes": [
        "name",
        "value"
      ],
      "representations": {
        "standard": [
          "name",
          "value"
        ],
        "minimal": [
          "name",
          "value"
        ]
      }
    },
    "settings": {
      "@type": "resource",
      "actions": {
        "for_repository": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/settings{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/settings{?include}"
          }
        ]
      },
      "attributes": [
        "settings"
      ],
      "representations": {
        "standard": [
          "settings"
        ]
      }
    },
    "stage": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "id",
        "number",
        "name",
        "state",
        "started_at",
        "finished_at",
        "jobs"
      ],
      "representations": {
        "minimal": [
          "id",
          "number",
          "name",
          "state",
          "started_at",
          "finished_at"
        ],
        "standard": [
          "id",
          "number",
          "name",
          "state",
          "started_at",
          "finished_at",
          "jobs"
        ]
      }
    },
    "stages": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/build/{build.id}/stages{?include}"
          }
        ]
      },
      "attributes": [
        "stages"
      ],
      "representations": {
        "standard": [
          "stages"
        ]
      }
    },
    "subscription": {
      "@type":            "resource",
      "actions":          { },
      "attributes":       [
        "id",
        "plan",
        "billing_info",
        "credit_card_info",
        "discount",
        "owner",
        "status",
        "valid_to",
        "created_at",
        "source",
        "cancellation_requested"
      ],
      "representations":  {
        "standard":       [
          "id",
          "plan",
          "billing_info",
          "credit_card_info",
          "discount",
          "owner",
          "status",
          "valid_to",
          "created_at",
          "source",
          "cancellation_requested"
        ],
        "minimal":       [
          "id",
          "owner",
          "status",
          "valid_to",
          "created_at",
          "source"
        ],
      },
    },
    "v2-subscription": {
      "@type":            "resource",
      "actions":          { },
      "attributes":       [
        "id",
        "plan",
        "addons",
        "billing_info",
        "credit_card_info",
        "discount",
        "owner",
        "created_at",
        "source",
        "cancellation_requested",
        "plan_shares",
      ],
      "representations":  {
        "standard":       [
          "id",
          "plan",
          "addons",
          "billing_info",
          "credit_card_info",
          "discount",
          "owner",
          "created_at",
          "source",
          "cancellation_requested",
          "plan_shares",
        ],
      },
    },
    "template": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "request_method",
        "uri_template"
      ]
    },
    "trial": {
      "@type": "resource",
      "actions": {},
      "attributes": [
        "builds_remaining",
        "created_at",
        "id",
        "owner",
        "status",
      ],
      "representations": {
        "standard": [
          "builds_remaining",
          "created_at",
          "id",
          "owner",
          "status",
        ],
      }
    },
    "user": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/user/{user.id}{?include}"
          }
        ],
        "sync": [
          {
            "@type": "template",
            "request_method": "POST",
            "uri_template": "/v3/user/{user.id}/sync",
            "accepted_params": [

            ]
          }
        ],
        "current": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/user{?include}"
          }
        ]
      },
      "attributes": [
        "id",
        "login",
        "name",
        "github_id",
        "avatar_url",
        "education",
        "allow_migration",
        "repositories",
        "installation",
        "is_syncing",
        "synced_at",
        "recently_signed_up",
        "vcs_type",
        "vcs_id",
        "allowance"
      ],
      "representations": {
        "minimal": [
          "id",
          "login"
        ],
        "standard": [
          "id",
          "login",
          "name",
          "github_id",
          "avatar_url",
          "education",
          "allow_migration",
          "is_syncing",
          "synced_at",
          "recently_signed_up",
          "vcs_type",
          "vcs_id",
          "allowance"
        ],
        "additional": [
          "repositories",
          "installation"
        ]
      },
      "permissions": [
        "read",
        "sync"
      ]
    }
  }
}
