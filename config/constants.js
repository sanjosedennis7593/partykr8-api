const ROLES = {
    admin: 'admin',
    super_admin: 'super_admin',
    talent: 'talent',
    user: 'user',
    vendor: 'vendor'
};

const TALENT_STATUS = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
};

const EVENT_STATUS = {
    pending: 'pending',
    cancelled: 'cancelled',
    ongoing: 'ongoing',
    finished: 'finished'
};

const TALENT_TYPES = {
    dj: 'dj',
    singer: 'singer',
    host: 'host',
    band: 'band',
    magician: 'magician'
};


export { 
    EVENT_STATUS,
    ROLES,
    TALENT_STATUS,
    TALENT_TYPES
};