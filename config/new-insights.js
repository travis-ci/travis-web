/* eslint-env node */
'use strict';

const deepFreeze = require('deep-freeze');

const NEW_INSIGHTS_PLUGIN_TYPES = [
  { id: 'aws', name: 'AWS Infrastructure' },
  { id: 'sre', name: 'Travis Insights' },
  { id: 'circleci', name: 'CircleCI' },
  { id: 'cloudwatch', name: 'AWS CloudWatch Monitoring' },
  { id: 'datadog', name: 'DataDog Monitoring' },
  { id: 'kube', name: 'Kubernetes Cluster' },
  { id: 'github', name: 'GitHub' },
  { id: 'pingdom', name: 'Pingdom Uptime Monitoring' },
  { id: 'gcp', name: 'GCP Infrastructure' },
  { id: 'gcs', name: 'Google Cloud Source Repositories' },
  { id: 'gitlab', name: 'Gitlab' },
  { id: 'bitbucket', name: 'Bitbucket' },
  { id: 'cloudflare', name: 'Cloudflare' },
  { id: 'assembla', name: 'Assembla' },
  { id: 'dyn', name: 'DynECT' },
  { id: 'heroku', name: 'Heroku' },
  { id: 'newrelic', name: 'NewRelic' },
  { id: 'okta', name: 'Okta' },
  { id: 'pagerduty', name: 'PagerDuty' },
  { id: 'rollbar', name: 'Rollbar' },
  { id: 'sentry', name: 'Sentry' },
  { id: 'sysdig', name: 'Sysdig' },
  { id: 'teamcity', name: 'TeamCity' },
  { id: 'travisci', name: 'Travis CI' },
  { id: 'buddyci', name: 'Buddy CI' },
  { id: 'sonarqube', name: 'Sonarqube' },
  { id: 'bamboo', name: 'Bamboo CI' },
  { id: 'cloudbees', name: 'Cloudbees' },
  { id: 'zendesk', name: 'Zendesk' },
  { id: 'godaddy', name: 'GoDaddy' },
  { id: 'codeclimate', name: 'CodeClimate' },
  { id: 'appdynamics', name: 'AppDynamics' },
  { id: 'artifactory', name: 'Artifactory' },
  { id: 'azure_devops', name: 'Azure DevOps' },
  { id: 'application_insights', name: 'Azure Application Insights' },
  { id: 'onelogin', name: 'OneLogin' },
  { id: 'azure', name: 'Azure' }
];

const NEW_INSIGHTS_PLUGIN_HELP_TEXT = {
  'aws': ['Where do I find my key?', '<p>Follow the "Creating IAM Users (Console)" guide found here: <a target="_blank" href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" >Creating a User in AWS</a></p><p>Create a new user with the "Programmatic access" checkbox selected and then attach the existing "ReadOnlyAccess" IAM policy.</p>'],
  'sre': ['Where do I find my key?', '<p>If you have deleted your default Travis Insights key, please contact support at #{SUPPORT_EMAIL}.</p>'],
  'cloudwatch': ['Where do I find my key?', '<p>Follow the "Creating IAM Users (Console)" guide found here: <a target="_blank" href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console">Creating a User in AWS</a></p><p>Create a new user with the "Programmatic access" checkbox selected and then attach the existing "ReadOnlyAccess" IAM policy.</p>'],
  'datadog': ['Where do I find my key?', '<p>Follow the steps here to create an API and application key here: <a target="_blank" href="https://app.datadoghq.com/account/settings#api">DataDog Authentication</a></p>'],
  'kube': ['How do I generate my key?', "<p>Follow the steps here to deploy the kubernetes agent on your cluster: <a target=\"_blank\" href=\"https://github.com/SREnity/kube-agent\">GitHub</a></p><p>Don't forget to save your generated public and private keys for adding to your deployment YAML.</p>"],
  'github': ['Where do I find my Access Token?', '<p>Follow the steps here to generate a personal access token: <a target="_blank" href="https://github.com/settings/tokens">Personal Access Tokens</a></p><p>The permissions you currently need to grant to this token are: repo, read:org, read:repo_hook, read:user, and user:email.</p>'],
  'pingdom': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://my.pingdom.com/app/api-tokens">Pingdom API tokens</a></p><p>You should ideally create a new user account that is <em>ONLY</em> used for this integration.</p>'],
  'gcp': [
    'Where do I find my key?',
    '<p>Generate a new key for the user or create a new user under IAM & Admin > Service Accounts in Google Console</p>'
  ],
  'gcs': [
    'Where do I find my key?',
    '<p>Generate a new key for the user or create a new user under IAM & Admin > Service Accounts in Google Console</p>'
  ],
  'circleci': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://circleci.com/account/api">CircleCI API tokens</a></p>'],
  'cloudflare': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://dash.cloudflare.com/profile/api-tokens">Cloudflare API tokens</a></p>'],
  'assembla': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://app.assembla.com/user/edit/manage_clients">Assembla API tokens</a></p>'],
  'dyn': ['', '<p>Use your username and password</p>'],
  'heroku': ['Where do I find my key?', '<p>Generate an API authorization here: <a target="_blank" href="https://dashboard.heroku.com/account/applications">Heroku API applications</a></p>'],
  'newrelic': ['Where do I find my key?', '<p>Generate an API key under Integrations > API keys in your account settings</p>'],
  'okta': ['Where do I find my key?', '<p>Generate an API token under Security > API > Tokens in your account</p>'],
  'pagerduty': ['Where do I find my key?', '<p>Generate an API key under Configuration > API access in your account</p>'],
  'rollbar': ['Where do I find my key?', '<p>Find your access token in project settings</p>'],
  'sentry': ['Where do I find my token?', '<p>Generate an auth token here: <a target="_blank" href="https://sentry.io/settings/account/api/auth-tokens/">Sentry auth tokens</a></p>'],
  'sysdig': ['Where do I find my token?', '<p>Find your auth token here: <a target="_blank" href="https://secure.sysdig.com/#/settings/user">Sysdig user settings</a></p>'],
  'teamcity': ['Where do I find my token?', '<p>Generate an API token under My Settings & Tools > Access Tokens in your account</p>'],
  'travisci': ['Where do I find my token?', '<p>Find your API token here: <a target="_blank" href="https://travis-ci.com/account/preferences">Travis CI Account Settings</a></p>'],
  'gitlab': [
    'Where do I find my token?',
    '<p>Generate an API token under User Settings > Access Tokens in your Gitlab instance or in gitlab.com</p>'
  ],
  'buddyci': ['Where do I find my token?', '<p>Generate an API token here: <a target="_blank" href="https://app.buddy.works/api-tokens">Buddy CI API Tokens</a></p>'],
  'sonarqube': ['Where do I find my token?', '<p>Generate an API key under My Account > Security > Tokens in your instance</p>'],
  'bamboo': ['', '<p>Use your username and password</p>'],
  'cloudbees': ['Where do I find my token?', '<p>Generate an API token under /me/configure in your Cloudbees instance</p>'],
  'zendesk': [
    'Where do I find my token?',
    '<p>Generate an API token under Admin > Channels > API in your Zendesk instance. Do not forget to enable Token Access in the same page</p>'
  ],
  'godaddy': ['Where do I find my key?', '<p>Generate an API key/secret pair here: <a target="_blank" href="https://developer.godaddy.com/keys">GoDaddy API Keys</a></p>'],
  'codeclimate': ['Where do I find my token?', '<p>Generate an API token here: <a target="_blank" href="https://codeclimate.com/profile/tokens">CodeClimate API Keys</a></p>'],
  'appdynamics': [
    'Where do I find my key?',
    '<p>Create an API client, then generate a temporary access token under Settings > Administration in your AppDynamics instance.</p>'
  ],
  'artifactory': ['Where do I find my key?', '<p>Generate an access token under Edit Profile in your Artifactory instance.</p>'],
  'azure_devops': [
    'Where do I find my token?',
    '<p>Generate an access token under Personal Access Token section in your Azure DevOps organization.</p>'
  ],
  'application_insights': [
    'Where do I find my API key?',
    '<p>Generate an access token under Configure > API access in your Azure Application Insights app.</p>'
  ],
  'onelogin': ['Where do I find my API credential pair?', '<p>Generate an API credential pair under Developers > API credentials in OneLogin.</p>'],
  'azure': [
    'Where do I find the needed data?',
    '<p>Generate a Security Principal using az CLI tool: az ad sp create-for-rbac --name "Travis Insights", then save response data</p>'
  ],
  'bitbucket': ['<a href="https://support.atlassian.com/bitbucket-cloud/docs/app-passwords" target="_blank"> Where do i find my App passwords?</a>', '']
};

const NEW_INSIGHTS_EXTERNAL_PLUGINS = [
  'kube'
];

const NEW_INSIGHTS_THREE_PART_PLUGINS = [
  'pingdom'
];

const NEW_INSIGHTS_URL_PLUGINS = [
  'bamboo', 'appdynamics', 'cloudbees', 'zendesk', 'gitlab',
  'artifactory', 'azure_devops', 'azure'
];

const NEW_INSIGHTS_PUBLIC_KEY_PLUGINS = [
  'aws', 'sre', 'cloudwatch', 'datadog', 'github', 'bamboo',
  'cloudbees', 'zendesk', 'sonarqube', 'godaddy', 'bitbucket',
  'assembla', 'dyn', 'azure_devops', 'application_insights',
  'okta', 'onelogin', 'azure', 'teamcity'
];

const NEW_INSIGHTS_PUBLIC_KEY_LABELS = {
  'aws': ['Public ID', 'This is the public id of Plugin', 'Enter Your AWS Public Key'],
  'circleci': ['API Token', 'This is the API token of Plugin', 'Enter Your CircleCI Personal API Token'],
  'cloudflare': ['API Token', 'This is the API token of Plugin', 'Enter Your Cloudflare API Token'],
  'codeclimate': ['API Token', 'This is the API token of Plugin', 'Enter Your CodeClimate API Token'],
  'sre': ['Public Key', 'This is the public key of Plugin', 'Enter Your Travis Insights Public Key'],
  'cloudwatch': ['Public ID', 'This is the public id of Plugin', 'Enter Your AWS CloudWatch Public ID'],
  'datadog': ['API Key', 'This is the API key of Plugin', 'Enter Your DataDog API Key'],
  'github': ['Username', 'This is the username of Plugin', 'Enter Your GitHub Username'],
  'bamboo': ['Username', 'This is the username of Plugin', 'Enter Your Bamboo CI Username'],
  'cloudbees': ['Username', 'This is the username of Plugin', 'Enter Your Cloudbees Username'],
  'zendesk': ['Email', 'This is the email of Plugin', 'Enter Your Zendesk Email'],
  'sonarqube': ['Sonarqube domain', 'This is the email of Plugin', 'Sonarqube domain'],
  'godaddy': ['API Key', 'This is the API key of Plugin', 'GoDaddy API key'],
  'bitbucket': ['Username', 'This is the username of Plugin', 'Enter Your Bitbucket Username'],
  'assembla': ['API Key', 'This is the API key of Plugin', 'Enter Your Assembla API key'],
  'dyn': ['Username', 'This is the username of Plugin', 'Enter Your Dyn Username'],
  'azure_devops': ['Username', 'This is the username of Plugin', 'Enter Your Azure Devops username'],
  'application_insights': ['Application ID', 'This is the application id of Plugin', 'Enter Your Azure Application Insights App ID'],
  'okta': ['Subdomain', 'This is the subdomain of Plugin', 'Enter Your Okta Subdomain'],
  'onelogin': ['API Key', 'This is the API key of Plugin', 'Enter Your OneLogin API key'],
  'azure': ['Application ID', 'This is the application id of Plugin', 'Enter Your Azure Service Principal Application ID'],
  'teamcity': ['URL', 'This is the URL of Plugin', 'Enter Your Teamcity instance URL'],
};

const NEW_INSIGHTS_PRIVATE_KEY_LABELS = {
  'aws': ['Private Key', 'This is the name of Plugin', 'Enter Your AWS Private Key'],
  'sre': ['Private Key', 'This is the name of Plugin', 'Enter Your Travis Insights Private Key'],
  'cloudwatch': ['Private Key', 'This is the name of Plugin', 'Enter Your AWS CloudWatch Private Key'],
  'datadog': ['Application Key', 'This is the name of Plugin', 'Enter Your Datadog Application Key'],
  'github': ['Personal Access Token', 'This is the name of Plugin', 'Enter Your GitHub Personal Access Token'],
  'bamboo': ['Password', 'This is the name of Plugin', 'Enter Your Bamboo CI Password'],
  'appdynamics': ['API token', 'This is the name of Plugin', 'Enter Your AppDynamics API token'],
  'cloudbees': ['API token', 'This is the name of Plugin', 'Enter Your Cloudbees API token'],
  'zendesk': ['API token', 'This is the name of Plugin', 'Enter Your Zendesk API token'],
  'pingdom': ['API token', 'This is the name of Plugin', 'Enter Your Pingdom API token'],
  'gcp': ['Service account private key', 'This is the name of Plugin', 'Paste the contents of the JSON key downloaded from Google Console'],
  'gcs': ['Service account private key', 'This is the name of Plugin', 'Paste the contents of the JSON key downloaded from Google Console'],
  'gitlab': ['Personal Access Token', 'This is the name of Plugin', 'Enter Your Personal Access Token'],
  'sonarqube': ['Personal Access Token', 'This is the name of Plugin', 'Enter Your Personal Access Token'],
  'buddyci': ['Personal Access Token', 'This is the name of Plugin', 'Enter Your Personal Access Token'],
  'godaddy': ['API secret', 'This is the name of Plugin', 'Enter Your GoDaddy API secret'],
  'bitbucket': ['App Password', 'This is the name of Plugin', 'Enter Your Bitbucket App Password'],
  'assembla': ['API secret', 'This is the name of Plugin', 'Enter Your Assembla API secret'],
  'dyn': ['Password', 'This is the name of Plugin', 'Enter Your Dyn Password'],
  'heroku': ['API Token', 'This is the name of Plugin', 'Enter Your Heroku API Token'],
  'artifactory': ['Access Token', 'This is the name of Plugin', 'Enter Your Artifactory Access Token'],
  'azure_devops': ['Personal Access Token', 'This is the name of Plugin', 'Enter Your Azure Devops Personal Access Token'],
  'application_insights': ['API key', 'This is the name of Plugin', 'Enter Your Azure Application Insights API key'],
  'newrelic': ['API key', 'This is the name of Plugin', 'Enter Your NewRelic API Key'],
  'okta': ['API key', 'This is the name of Plugin', 'Enter Your Okta API Key'],
  'pagerduty': ['API key', 'This is the name of Plugin', 'Enter Your PagerDuty API Key'],
  'rollbar': ['Access Token', 'This is the name of Plugin', 'Enter Your Rollbar Access Token'],
  'sentry': ['Auth Token', 'This is the name of Plugin', 'Enter Your Sentry Auth Token'],
  'onelogin': ['API Secret', 'This is the name of Plugin', 'Enter Your OneLogin API secret'],
  'azure': ['Password', 'This is the name of Plugin', 'Enter Your Azure Service Principal Password'],
  'sysdig': ['API Token', 'This is the name of Plugin', 'Enter Your Sysdig API Token'],
  'teamcity': ['API Token', 'This is the name of Plugin', 'Enter Your Teamcity API Token'],
  'travisci': ['API Token', 'This is the name of Plugin', 'Enter Your Travis CI API Token'],
};

const NEW_INSIGHTS_URL_LABELS = {
  'bamboo': ['URL', 'This is the Plugin domain', 'Enter Your Bamboo CI instance URL (i.e. https://bamboo.example.com)'],
  'appdynamics': ['Instance URL', '', 'Enter Your AppDynamics instance URL (i.e. https://appdynamics.example.com)'],
  'cloudbees': ['URL', 'This is the Plugin domain', 'Enter Your Cloudbees instance URL (i.e. https://cloudbees.example.com)'],
  'zendesk': ['Subdomain', 'This is the Plugin domain', 'Enter Your Zendesk instance URL (i.e. subdomain1 from https://subdomain1.zendesk.com)'],
  'gitlab': ['Gitlab domain', 'This is the Plugin domain', 'Gitlab domain'],
  'artifactory': ['Instance URL', 'This is the Plugin domain', 'Enter Your Artifactory instance URL (i.e. https://artifactory.example.com)'],
  'azure_devops': ['Organization name', 'This is the Plugin domain', 'Enter Your Azure DevOps organization name'],
  'azure': ['Tenant ID', 'This is the Plugin domain', 'Enter Your Azure Tenant ID'],
};

module.exports = deepFreeze({
  pluginTypes: NEW_INSIGHTS_PLUGIN_TYPES,
  pluginHelpText: NEW_INSIGHTS_PLUGIN_HELP_TEXT,
  externalPlugins: NEW_INSIGHTS_EXTERNAL_PLUGINS,
  threePartPlugins: NEW_INSIGHTS_THREE_PART_PLUGINS,
  urlPlugins: NEW_INSIGHTS_URL_PLUGINS,
  publicKeyPlugins: NEW_INSIGHTS_PUBLIC_KEY_PLUGINS,
  publicKeyLabels: NEW_INSIGHTS_PUBLIC_KEY_LABELS,
  privateKeyLabels: NEW_INSIGHTS_PRIVATE_KEY_LABELS,
  urlLabels: NEW_INSIGHTS_URL_LABELS,
});
