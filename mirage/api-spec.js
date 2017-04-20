/* eslint-disable */
export default {
  "@type": "home",
  "@href": "/v3/",
  "config": {
    "host": "travis-ci.org",
    "github": {
      "api_url": "https://api.github.com",
      "web_url": "https://github.com",
      "scopes": [
        "read:org",
        "user:email",
        "repo_deployment",
        "repo:status",
        "write:repo_hook"
      ]
    },
    "pusher": {
      "key": "5df8ac576dcccf4fd076"
    }
  },
  "errors": {
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
    "account": {
      "@type": "resource",
      "actions": {
      },
      "attributes": ["id","subscribed","educational","owner"],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "subscribed",
          "educational",
          "owner"
        ]
      },
      "permissions": [
        "read"
      ]
    },
    "accounts": {
      "@type": "resource",
      "actions": {
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/accounts{?include}"
          }
        ]
      },
      "attributes": ["accounts"],
      "representations": {
        "standard": ["accounts"]
      }
    },
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
      "attributes": ["builds"],
      "representations": {
        "standard": ["builds"]
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
      "attributes": ["id","name","description","enabled","feedback_url","standard","staff_only"],
      "representations": {
        "standard": [
          "id",
          "name",
          "description",
          "enabled",
          "feedback_url"
        ],
        "staff_only": [
          "standard",
          "staff_only"
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
      "attributes": ["beta_features"],
      "representations": {
        "standard": ["beta_features"]
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
      "attributes": ["name","repository","default_branch","exists_on_github","last_build"],
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
      "attributes": ["branches"],
      "representations": {
        "standard": ["branches"]
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
      "attributes": ["id","message","created_at","category","active","recipient"],
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
      "attributes": ["broadcasts"],
      "representations": {
        "standard": ["broadcasts"]
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
        ]
      },
      "attributes": ["id","number","state","duration","event_type","previous_state","pull_request_title","pull_request_number","started_at","finished_at","repository","branch","commit","jobs"],
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
          "finished_at"
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
          "repository",
          "branch",
          "commit",
          "jobs"
        ],
        "active": [
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
          "repository",
          "branch",
          "commit",
          "jobs"
        ]
      },
      "permissions": [
        "read",
        "cancel",
        "restart"
      ]
    },
    "builds": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/builds{?branch.name,build.event_type,build.previous_state,build.state,event_type,include,limit,offset,previous_state,sort_by,state}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/builds{?branch.name,build.event_type,build.previous_state,build.state,event_type,include,limit,offset,previous_state,sort_by,state}"
          }
        ]
      },
      "attributes": ["builds"],
      "representations": {
        "standard": ["builds"]
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
            "uri_template": "/v3/repo/{repository.id}/caches{?branch,caches.branch,caches.name,include,name}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/caches{?branch,caches.branch,caches.name,include,name}"
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
        "name"
      ],
      "representations": {
        "standard": [
          "branch",
          "name"
        ]
      }
    },
    "commit": {
      "@type": "resource",
      "actions": {
      },
      "attributes": ["id","sha","ref","message","compare_url","committed_at","committer","author"],
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
      "attributes": ["id","repository","branch","interval","dont_run_if_recent_build_exists","last_run","next_run","created_at"],
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
          "created_at"
        ]
      },
      "permissions": [
        "read",
        "delete",
        "start"
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
      "attributes": ["crons"],
      "representations": {
        "standard": ["crons"]
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
      "attributes": ["id","name","value","public"],
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
      "attributes": ["env_vars"],
      "representations": {
        "standard": ["env_vars"]
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
        "find": {
          "@type": "template",
          "request_method": "GET",
          "uri_template": "/v3/"
        }
      },
      "attributes": [
        "config",
        "errors",
        "resources"
      ]
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
      "attributes": ["id","number","state","started_at","finished_at","build","queue","repository","commit","owner"],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "number",
          "state",
          "started_at",
          "finished_at",
          "build",
          "queue",
          "repository",
          "commit",
          "owner"
        ],
        "active": [
          "id",
          "number",
          "state",
          "started_at",
          "finished_at",
          "build",
          "queue",
          "repository",
          "commit",
          "owner"
        ]
      },
      "permissions": [
        "read",
        "debug",
        "cancel",
        "restart",
        "delete_log"
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
        ]
      },
      "attributes": ["jobs"],
      "representations": {
        "standard": ["jobs"]
      }
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
      "attributes": ["description","public_key","fingerprint"],
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
            "uri_template": "/v3/job/{job.id}/log{?include}"
          }
        ],
        "delete": [
          {
            "@type": "template",
            "request_method": "DELETE",
            "uri_template": "/v3/job/{job.id}/log"
          }
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
      "attributes": ["id","login","name","github_id","avatar_url","repositories"],
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
          "avatar_url"
        ],
        "additional": [
          "repositories"
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
            "uri_template": "/v3/orgs{?include,limit,offset,sort_by}"
          }
        ]
      },
      "attributes": ["organizations"],
      "representations": {
        "standard": ["organizations"]
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
      "attributes": ["id","login","name","github_id","avatar_url","repositories"],
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
          "avatar_url"
        ],
        "additional": [
          "repositories"
        ]
      }
    },
    "repositories": {
      "@type": "resource",
      "actions": {
        "for_owner": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{owner.login}/repos{?active,include,limit,offset,private,repository.active,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{user.login}/repos{?active,include,limit,offset,private,repository.active,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/{organization.login}/repos{?active,include,limit,offset,private,repository.active,repository.private,repository.starred,sort_by,starred}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/owner/github_id/{owner.github_id}/repos{?active,include,limit,offset,private,repository.active,repository.private,repository.starred,sort_by,starred}"
          }
        ],
        "for_current_user": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repos{?active,include,limit,offset,private,repository.active,repository.private,repository.starred,sort_by,starred}"
          }
        ]
      },
      "attributes": ["repositories"],
      "representations": {
        "standard": ["repositories"]
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
      "attributes": ["id","name","slug","description","github_language","active","private","owner","default_branch","starred","current_build"],
      "representations": {
        "minimal": [
          "id",
          "name",
          "slug"
        ],
        "standard": [
          "id",
          "name",
          "slug",
          "description",
          "github_language",
          "active",
          "private",
          "owner",
          "default_branch",
          "starred"
        ]
      },
      "permissions": [
        "read",
        "admin",
        "activate",
        "deactivate",
        "star",
        "unstar",
        "create_cron",
        "create_env_var",
        "create_key_pair",
        "create_request"
      ]
    },
    "request": {
      "@type": "resource",
      "actions": {
      },
      "attributes": ["id","repository","branch_name","commit","owner","created_at","result","message","event_type"],
      "representations": {
        "minimal": [
          "id"
        ],
        "standard": [
          "id",
          "repository",
          "branch_name",
          "commit",
          "owner",
          "created_at",
          "result",
          "message",
          "event_type"
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
      "attributes": ["requests"],
      "representations": {
        "standard": ["requests"]
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
    "stage": {
      "@type": "resource",
      "actions": {
      },
      "attributes": [
        "id",
        "name",
        "number",
        "state",
        "started_at",
        "finished_at"
      ],
      "representations": {
        "minimal": [
          "id", "name", "number", "state", "started_at", "finished_at"
        ],
        "standard": [
          "id", "name", "number", "state", "started_at", "finished_at"
        ]
      }
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
      "attributes": ["id","login","name","github_id","avatar_url","repositories","is_syncing","synced_at"],
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
          "is_syncing",
          "synced_at"
        ],
        "additional": [
          "repositories"
        ]
      },
      "permissions": [
        "read",
        "sync"
      ]
    },
    "user_setting": {
      "@type": "resource",
      "actions": {
        "find": [
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.id}/setting/{user_setting.name}{?include}"
          },
          {
            "@type": "template",
            "request_method": "GET",
            "uri_template": "/v3/repo/{repository.slug}/setting/{user_setting.name}{?include}"
          }
        ],
        "update": [
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.id}/setting/{user_setting.name}",
            "accepted_params": [
              "user_setting.value"
            ]
          },
          {
            "@type": "template",
            "request_method": "PATCH",
            "uri_template": "/v3/repo/{repository.slug}/setting/{user_setting.name}",
            "accepted_params": [
              "user_setting.value"
            ]
          }
        ]
      },
      "attributes": ["name","value"],
      "representations": {
        "standard": [
          "name",
          "value"
        ],
        "minimal": [
          "name",
          "value"
        ]
      },
      "permissions": [
        "read",
        "write"
      ]
    },
    "user_settings": {
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
      "attributes": ["user_settings"],
      "representations": {
        "standard": ["user_settings"]
      }
    }
  }
}
