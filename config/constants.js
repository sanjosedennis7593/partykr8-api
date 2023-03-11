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
    magician: 'magician',
    lights_and_sounds: 'lights_and_sounds',
    led_wall: 'led_wall',
    choreographer: 'Choreographer',
    choir_instructor: 'Choir Instructor',
    acoustic_band: 'Acoustic Band',
    dance_group: 'Dance Group',
    bubble_show: 'Bubble Show',
    face_painter: 'Face Painter',
    photo_video: 'Photo Video',
    bouncy_castle: 'Bouncy Castle',
    gensets: 'Gensets',
    event_stylist: 'Event Stylist',
    event_coordinator: 'Event Coordinator',
    wedding_planner: 'Wedding Planner',
    band_equipment: 'Band Equipment',
    dj_equipment: 'DJ Equipment',
    mobile_bar: 'Mobile Bar',
    table_and_chairs: 'Table and Chairs',
    photographer: 'Photographer',
    videographer: 'Videographer',
    souvenir_supplier: 'Souvenir Supplies',
    venue: 'Venue',
    caterer: 'Caterer'
};


const EVENT_TYPE_RATE_FIELDS = {
    birthday: 'birthday_rate_per_day',
    debut: 'debut_rate_per_day',
    wedding: 'wedding_rate_per_day',
    baptismal: 'baptismal_rate_per_day',
    seminar: 'seminar_rate_per_day',
    company_party: 'company_party_rate_per_day',
    school_event: 'school_rate_per_day',
    hangout_get_together: 'hangout_get_together',
    others: 'others'
};



export { 
    EVENT_STATUS,
    EVENT_TYPE_RATE_FIELDS,
    ROLES,
    TALENT_STATUS,
    TALENT_TYPES
};