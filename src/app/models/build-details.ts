export interface BuildDetails {
    id: number
    number: number
    parent: number
    event: string
    status: string
    error: string
    enqueued_at: number
    created_at: number
    started_at: number
    finished_at: number
    deploy_to: string
    commit: string
    branch: string
    ref: string
    refspec: string
    remote: string
    title: string
    message: string
    timestamp: number
    sender: string
    author: string
    author_avatar: string
    author_email: string
    link_url: string
    signed: boolean
    verified: boolean
    reviewed_by: string
    reviewed_at: number
    procs: Process[]
}

export interface Process {
    id: number
    build_id: number
    pid: number
    ppid: number
    pgid: number
    name: string
    state: string
    exit_code: number
    start_time: number
    end_time: number    
    machine: string
    children: Process[]
    error: string
}

export interface BuildLog {
    out: string,
    pos: number,
    proc: string,
    time: number
}
