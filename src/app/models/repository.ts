export interface Repository {
    "id":number,
    "owner":string,
    "name":string,
    "full_name":string,
    "avatar_url":string,
    "link_url":string,
    "scm":string,
    "clone_url":string,
    "default_branch":string,
    "timeout":number,
    "visibility":string,
    "private":boolean,
    "trusted":boolean,
    "gated":boolean,
    "active":boolean,
    "allow_pr":boolean,
    "allow_push":boolean,
    "allow_deploys":boolean,
    "allow_tags":boolean,
    "last_build":number,
    "config_file":string
}

export interface RouterParams {
    user: string, 
    repo: string, 
    build?: number,
    pid?: number
}
