window.DBTT_DATA = {
  "SITE": {
    "name": "dbt Complete Tutorial",
    "version": "dbt 1.8+"
  },
  "LEVELS": [
    {
      "key": "beginner",
      "name": "Beginner",
      "label": "Foundations",
      "accent": "#10b981",
      "icon": "rocket"
    },
    {
      "key": "intermediate",
      "name": "Intermediate",
      "label": "Level Up",
      "accent": "#f59e0b",
      "icon": "wrench"
    },
    {
      "key": "advanced",
      "name": "Advanced",
      "label": "Go Deep",
      "accent": "#ef4444",
      "icon": "flame"
    },
    {
      "key": "expert",
      "name": "Expert",
      "label": "Master Class",
      "accent": "#7c3aed",
      "icon": "crown"
    }
  ],
  "TOPICS": [
    {
      "level": "beginner",
      "slug": "1-intro",
      "title": "What is dbt? Why use it?",
      "nav": "What is dbt?",
      "lede": "Meet the tool that turns raw SQL files into a tested, documented, version-controlled data pipeline.",
      "icon": "compass",
      "time": 15,
      "tags": [
        "concepts",
        "analytics-engineering"
      ]
    },
    {
      "level": "beginner",
      "slug": "2-installation",
      "title": "Setup & Installation",
      "nav": "Setup & Installation",
      "lede": "Install dbt-core with the DuckDB adapter on Linux or Windows and wire up your first profile.",
      "icon": "package",
      "time": 30,
      "tags": [
        "setup",
        "duckdb",
        "profiles"
      ]
    },
    {
      "level": "beginner",
      "slug": "3-core-concepts",
      "title": "Core Concepts: Models, Sources & Seeds",
      "nav": "Core Concepts",
      "lede": "The four building blocks of every dbt project — and how ref() stitches them into a DAG.",
      "icon": "blocks",
      "time": 25,
      "tags": [
        "models",
        "sources",
        "seeds",
        "ref"
      ]
    },
    {
      "level": "beginner",
      "slug": "4-your-first-model",
      "title": "Your First dbt Model",
      "nav": "Your First Model",
      "lede": "Write, compile and run a real model against sample e-commerce data, then inspect the result.",
      "icon": "hammer",
      "time": 30,
      "tags": [
        "models",
        "sql",
        "duckdb"
      ]
    },
    {
      "level": "beginner",
      "slug": "5-seeds-and-sources",
      "title": "Seeds & Sources Explained",
      "nav": "Seeds & Sources",
      "lede": "Load small reference CSVs with seeds and register raw warehouse tables with sources.",
      "icon": "sprout",
      "time": 20,
      "tags": [
        "seeds",
        "sources",
        "csv"
      ]
    },
    {
      "level": "beginner",
      "slug": "6-basic-tests",
      "title": "Basic Tests (NOT NULL, UNIQUE)",
      "nav": "Basic Tests",
      "lede": "Catch dirty data before it reaches a dashboard with dbt’s built-in generic tests.",
      "icon": "check",
      "time": 15,
      "tags": [
        "tests",
        "data-quality"
      ]
    },
    {
      "level": "intermediate",
      "slug": "1-concepts",
      "title": "Materializations: View, Table & Incremental",
      "nav": "Materializations",
      "lede": "Choose how dbt persists each model — and understand the freshness, cost and performance trade-offs.",
      "icon": "box",
      "time": 20,
      "tags": [
        "materializations",
        "incremental",
        "performance"
      ]
    },
    {
      "level": "intermediate",
      "slug": "2-macros-jinja",
      "title": "Macros & Jinja Templating",
      "nav": "Macros & Jinja",
      "lede": "Stop copy-pasting SQL. Write reusable functions with Jinja macros and control flow.",
      "icon": "puzzle",
      "time": 35,
      "tags": [
        "jinja",
        "macros",
        "dry"
      ]
    },
    {
      "level": "intermediate",
      "slug": "3-tests-refine",
      "title": "Refining Tests with dbt_utils",
      "nav": "Tests with dbt_utils",
      "lede": "Go beyond not_null and unique with relationships, accepted_values and dbt_utils power tests.",
      "icon": "flask-conical",
      "time": 15,
      "tags": [
        "tests",
        "dbt_utils",
        "data-quality"
      ]
    },
    {
      "level": "intermediate",
      "slug": "4-snapshots",
      "title": "Snapshots for SCD Type 2",
      "nav": "Snapshots (SCD2)",
      "lede": "Record history automatically. Snapshot a mutable table and query how each row changed over time.",
      "icon": "history",
      "time": 20,
      "tags": [
        "snapshots",
        "scd2",
        "history"
      ]
    },
    {
      "level": "intermediate",
      "slug": "5-ci-cd",
      "title": "CI/CD Pipelines Overview",
      "nav": "CI/CD Overview",
      "lede": "The ideas behind continuous integration and delivery for data: what runs, when, and why.",
      "icon": "refresh-cw",
      "time": 15,
      "tags": [
        "ci-cd",
        "automation",
        "github-actions"
      ]
    },
    {
      "level": "intermediate",
      "slug": "6-performance",
      "title": "Query Optimization & Caching",
      "nav": "Performance & Caching",
      "lede": "dbt only rebuilds what changed. Learn the DAG state, incremental builds and cheaper queries.",
      "icon": "zap",
      "time": 20,
      "tags": [
        "performance",
        "caching",
        "incremental"
      ]
    },
    {
      "level": "intermediate",
      "slug": "7-exposures",
      "title": "Exposures: Tracking Business Metrics",
      "nav": "Exposures",
      "lede": "Connect your models to the dashboards and metrics that depend on them — closing the lineage loop.",
      "icon": "chart-line",
      "time": 15,
      "tags": [
        "exposures",
        "lineage",
        "docs"
      ]
    },
    {
      "level": "advanced",
      "slug": "1-sources",
      "title": "Source Discovery & Lineage",
      "nav": "Sources & Lineage",
      "lede": "Make raw tables first-class citizens with freshness checks, source tests and end-to-end lineage.",
      "icon": "satellite",
      "time": 30,
      "tags": [
        "sources",
        "freshness",
        "lineage",
        "contracts"
      ]
    },
    {
      "level": "advanced",
      "slug": "2-macros-advanced",
      "title": "Advanced Macro Patterns",
      "nav": "Advanced Macros",
      "lede": "Dispatch, adapter-aware SQL, run_query and packaging macros into installable dbt packages.",
      "icon": "cog",
      "time": 25,
      "tags": [
        "jinja",
        "macros",
        "packages",
        "adapters"
      ]
    },
    {
      "level": "advanced",
      "slug": "3-ci-cd-github-actions",
      "title": "CI/CD with GitHub Actions",
      "nav": "GitHub Actions",
      "lede": "A real workflow file: lint, build on a clone, run tests on every pull request, deploy on merge.",
      "icon": "bot",
      "time": 20,
      "tags": [
        "ci-cd",
        "github-actions",
        "yaml"
      ]
    },
    {
      "level": "advanced",
      "slug": "4-performance-optimization",
      "title": "Performance Tuning at Scale",
      "nav": "Performance at Scale",
      "lede": "Partitioning, clustering, incremental strategy and threading for datasets in the tens of millions.",
      "icon": "gauge",
      "time": 15,
      "tags": [
        "performance",
        "partitions",
        "incremental"
      ]
    },
    {
      "level": "expert",
      "slug": "1-materializations",
      "title": "Custom Materializations & Build Hooks",
      "nav": "Custom Materializations",
      "lede": "Write your own materialization and hook into dbt’s lifecycle for logic the built-ins can’t express.",
      "icon": "dna",
      "time": 30,
      "tags": [
        "materializations",
        "python",
        "hooks"
      ]
    },
    {
      "level": "expert",
      "slug": "2-ci-cd-deploy",
      "title": "CI/CD Deployment Pipelines",
      "nav": "Deployment Pipelines",
      "lede": "Promote the same artifacts from dev → staging → production with approvals and safe rollback.",
      "icon": "rocket",
      "time": 25,
      "tags": [
        "ci-cd",
        "deployment",
        "environments"
      ]
    },
    {
      "level": "expert",
      "slug": "3-performance-expert",
      "title": "Expert-Level Query Optimization",
      "nav": "Expert Optimization",
      "lede": "Partition pruning, materialized caches, micro-batching and reading the query plan like a DBA.",
      "icon": "sliders-horizontal",
      "time": 30,
      "tags": [
        "performance",
        "query-plan",
        "partitions"
      ]
    },
    {
      "level": "expert",
      "slug": "4-best-practices",
      "title": "Best Practices & Patterns",
      "nav": "Best Practices",
      "lede": "Naming, project layout, code review and the team conventions that keep a warehouse trustworthy.",
      "icon": "landmark",
      "time": 20,
      "tags": [
        "best-practices",
        "naming",
        "team"
      ]
    }
  ],
  "search": [
    {
      "title": "What is dbt? Why use it?",
      "lede": "Meet the tool that turns raw SQL files into a tested, documented, version-controlled data pipeline.",
      "level": "beginner",
      "url": "beginner/1-intro.html",
      "tags": [
        "concepts",
        "analytics-engineering"
      ]
    },
    {
      "title": "Setup & Installation",
      "lede": "Install dbt-core with the DuckDB adapter on Linux or Windows and wire up your first profile.",
      "level": "beginner",
      "url": "beginner/2-installation.html",
      "tags": [
        "setup",
        "duckdb",
        "profiles"
      ]
    },
    {
      "title": "Core Concepts: Models, Sources & Seeds",
      "lede": "The four building blocks of every dbt project — and how ref() stitches them into a DAG.",
      "level": "beginner",
      "url": "beginner/3-core-concepts.html",
      "tags": [
        "models",
        "sources",
        "seeds",
        "ref"
      ]
    },
    {
      "title": "Your First dbt Model",
      "lede": "Write, compile and run a real model against sample e-commerce data, then inspect the result.",
      "level": "beginner",
      "url": "beginner/4-your-first-model.html",
      "tags": [
        "models",
        "sql",
        "duckdb"
      ]
    },
    {
      "title": "Seeds & Sources Explained",
      "lede": "Load small reference CSVs with seeds and register raw warehouse tables with sources.",
      "level": "beginner",
      "url": "beginner/5-seeds-and-sources.html",
      "tags": [
        "seeds",
        "sources",
        "csv"
      ]
    },
    {
      "title": "Basic Tests (NOT NULL, UNIQUE)",
      "lede": "Catch dirty data before it reaches a dashboard with dbt’s built-in generic tests.",
      "level": "beginner",
      "url": "beginner/6-basic-tests.html",
      "tags": [
        "tests",
        "data-quality"
      ]
    },
    {
      "title": "Materializations: View, Table & Incremental",
      "lede": "Choose how dbt persists each model — and understand the freshness, cost and performance trade-offs.",
      "level": "intermediate",
      "url": "intermediate/1-concepts.html",
      "tags": [
        "materializations",
        "incremental",
        "performance"
      ]
    },
    {
      "title": "Macros & Jinja Templating",
      "lede": "Stop copy-pasting SQL. Write reusable functions with Jinja macros and control flow.",
      "level": "intermediate",
      "url": "intermediate/2-macros-jinja.html",
      "tags": [
        "jinja",
        "macros",
        "dry"
      ]
    },
    {
      "title": "Refining Tests with dbt_utils",
      "lede": "Go beyond not_null and unique with relationships, accepted_values and dbt_utils power tests.",
      "level": "intermediate",
      "url": "intermediate/3-tests-refine.html",
      "tags": [
        "tests",
        "dbt_utils",
        "data-quality"
      ]
    },
    {
      "title": "Snapshots for SCD Type 2",
      "lede": "Record history automatically. Snapshot a mutable table and query how each row changed over time.",
      "level": "intermediate",
      "url": "intermediate/4-snapshots.html",
      "tags": [
        "snapshots",
        "scd2",
        "history"
      ]
    },
    {
      "title": "CI/CD Pipelines Overview",
      "lede": "The ideas behind continuous integration and delivery for data: what runs, when, and why.",
      "level": "intermediate",
      "url": "intermediate/5-ci-cd.html",
      "tags": [
        "ci-cd",
        "automation",
        "github-actions"
      ]
    },
    {
      "title": "Query Optimization & Caching",
      "lede": "dbt only rebuilds what changed. Learn the DAG state, incremental builds and cheaper queries.",
      "level": "intermediate",
      "url": "intermediate/6-performance.html",
      "tags": [
        "performance",
        "caching",
        "incremental"
      ]
    },
    {
      "title": "Exposures: Tracking Business Metrics",
      "lede": "Connect your models to the dashboards and metrics that depend on them — closing the lineage loop.",
      "level": "intermediate",
      "url": "intermediate/7-exposures.html",
      "tags": [
        "exposures",
        "lineage",
        "docs"
      ]
    },
    {
      "title": "Source Discovery & Lineage",
      "lede": "Make raw tables first-class citizens with freshness checks, source tests and end-to-end lineage.",
      "level": "advanced",
      "url": "advanced/1-sources.html",
      "tags": [
        "sources",
        "freshness",
        "lineage",
        "contracts"
      ]
    },
    {
      "title": "Advanced Macro Patterns",
      "lede": "Dispatch, adapter-aware SQL, run_query and packaging macros into installable dbt packages.",
      "level": "advanced",
      "url": "advanced/2-macros-advanced.html",
      "tags": [
        "jinja",
        "macros",
        "packages",
        "adapters"
      ]
    },
    {
      "title": "CI/CD with GitHub Actions",
      "lede": "A real workflow file: lint, build on a clone, run tests on every pull request, deploy on merge.",
      "level": "advanced",
      "url": "advanced/3-ci-cd-github-actions.html",
      "tags": [
        "ci-cd",
        "github-actions",
        "yaml"
      ]
    },
    {
      "title": "Performance Tuning at Scale",
      "lede": "Partitioning, clustering, incremental strategy and threading for datasets in the tens of millions.",
      "level": "advanced",
      "url": "advanced/4-performance-optimization.html",
      "tags": [
        "performance",
        "partitions",
        "incremental"
      ]
    },
    {
      "title": "Custom Materializations & Build Hooks",
      "lede": "Write your own materialization and hook into dbt’s lifecycle for logic the built-ins can’t express.",
      "level": "expert",
      "url": "expert/1-materializations.html",
      "tags": [
        "materializations",
        "python",
        "hooks"
      ]
    },
    {
      "title": "CI/CD Deployment Pipelines",
      "lede": "Promote the same artifacts from dev → staging → production with approvals and safe rollback.",
      "level": "expert",
      "url": "expert/2-ci-cd-deploy.html",
      "tags": [
        "ci-cd",
        "deployment",
        "environments"
      ]
    },
    {
      "title": "Expert-Level Query Optimization",
      "lede": "Partition pruning, materialized caches, micro-batching and reading the query plan like a DBA.",
      "level": "expert",
      "url": "expert/3-performance-expert.html",
      "tags": [
        "performance",
        "query-plan",
        "partitions"
      ]
    },
    {
      "title": "Best Practices & Patterns",
      "lede": "Naming, project layout, code review and the team conventions that keep a warehouse trustworthy.",
      "level": "expert",
      "url": "expert/4-best-practices.html",
      "tags": [
        "best-practices",
        "naming",
        "team"
      ]
    }
  ]
};
