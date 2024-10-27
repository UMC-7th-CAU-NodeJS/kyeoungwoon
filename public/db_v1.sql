create table alarm_type
(
    alarm_type_id int auto_increment
        primary key,
    type          varchar(100) not null,
    created_at    datetime(6)  not null,
    updated_at    datetime(6)  null
);

create table area
(
    area_id    int auto_increment
        primary key,
    name       varchar(30)  not null,
    address    varchar(100) not null,
    created_at datetime(6)  not null,
    updated_at datetime(6)  null
);

create table prefer
(
    prefer_id  int auto_increment
        primary key,
    name       varchar(30) not null,
    created_at datetime(6) not null,
    updated_at datetime(6) null
);

create table store
(
    store_id   int auto_increment
        primary key,
    name       varchar(100) not null,
    address    varchar(100) not null,
    type       varchar(30)  not null,
    created_at datetime(6)  not null,
    updated_at datetime(6)  null
);

create table mission
(
    mission_id int auto_increment
        primary key,
    reward     int         not null,
    name       varchar(30) not null,
    store_id   int         not null,
    area_id    int         null,
    created_at datetime(6) not null,
    updated_at datetime(6) null,
    constraint mission_area_area_id_fk
        foreign key (area_id) references area (area_id),
    constraint mission_store_store_id_fk
        foreign key (store_id) references store (store_id)
);

create table area_mission
(
    area_mission_id int auto_increment
        primary key,
    area_id         int         not null,
    mission_id      int         not null,
    created_at      datetime(6) not null,
    updated_at      datetime(6) null,
    constraint area_mission_area_area_id_fk
        foreign key (area_id) references area (area_id),
    constraint area_mission_mission_mission_id_fk
        foreign key (mission_id) references mission (mission_id)
);

create table term
(
    term_id     int auto_increment
        primary key,
    title       varchar(100)  not null,
    content     varchar(4096) not null,
    is_required tinyint(1)    null,
    created_at  datetime(6)   not null,
    updated_at  datetime(6)   null
);

create table user
(
    user_id                  int auto_increment
        primary key,
    name                     varchar(30)  not null,
    nickname                 varchar(30)  not null,
    age                      int          not null,
    gender                   varchar(30)  not null,
    phone_number             varchar(30)  null,
    is_phone_number_verified tinyint(1)   not null,
    address                  varchar(100) null,
    email                    varchar(30)  null,
    point                    int          null,
    created_at               datetime(6)  not null,
    inactive_at              datetime(6)  null,
    terminated_at            datetime(6)  null
);

create table alarm
(
    alarm_id      int auto_increment
        primary key,
    user_id       int           not null,
    alarm_type_id int           not null,
    content       varchar(1024) not null,
    raised_at     datetime(6)   not null,
    checked_at    datetime(6)   null,
    created_at    datetime(6)   not null,
    updated_at    datetime(6)   null,
    constraint alarm_alarm_type_alarm_type_id_fk
        foreign key (alarm_type_id) references alarm_type (alarm_type_id),
    constraint alarm_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table personal_inquiry
(
    personal_inquiry_id int auto_increment
        primary key,
    user_id             int           not null,
    title               varchar(100)  not null,
    content             varchar(2048) not null,
    photo_url_1         varchar(200)  null,
    photo_url_2         varchar(200)  null,
    photo_url_3         varchar(200)  null,
    status              int           not null,
    raised_date         datetime(6)   not null,
    closed_date         datetime(6)   null,
    created_at          datetime(6)   not null,
    updated_at          datetime(6)   null,
    constraint personal_inquiry_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table point_log
(
    point_log_id int auto_increment
        primary key,
    user_id      int         not null,
    point_change int         not null,
    change_date  datetime(6) not null,
    created_at   datetime(6) not null,
    updated_at   datetime(6) null,
    constraint point_log_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table review
(
    review_id   int auto_increment
        primary key,
    content     varchar(100) not null,
    star        int          not null,
    user_id     int          not null,
    store_id    int          not null,
    photo_url_1 varchar(200) null,
    photo_url_2 varchar(200) null,
    photo_url_3 varchar(200) null,
    created_at  datetime(6)  not null,
    updated_at  datetime(6)  null,
    constraint review_ibfk_1
        foreign key (user_id) references user (user_id),
    constraint review_ibfk_2
        foreign key (store_id) references store (store_id)
);

create table user_alarm_preference
(
    user_alarm_preference_id int auto_increment
        primary key,
    user_id                  int         not null,
    alarm_type_id            int         not null,
    status                   tinyint(1)  not null,
    created_at               datetime(6) not null,
    updated_at               datetime(6) null,
    constraint user_alarm_preference_ibfk_1
        foreign key (alarm_type_id) references alarm_type (alarm_type_id),
    constraint user_alarm_preference_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table user_area_count
(
    user_area_count_id int auto_increment
        primary key,
    user_id            int         not null,
    area_id            int         not null,
    count              int         null,
    created_at         datetime(6) not null,
    updated_at         datetime(6) null,
    constraint user_area_count_ibfk_1
        foreign key (area_id) references area (area_id),
    constraint user_area_count_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table user_mission
(
    user_mission_id int auto_increment
        primary key,
    user_id         int                                     not null,
    mission_id      int                                     not null,
    status          enum ('in_progress', 'success', 'fail') not null,
    started_at      datetime(6)                             not null,
    finished_at     datetime(6)                             null,
    created_at      datetime(6)                             not null,
    updated_at      datetime(6)                             null,
    constraint user_mission_mission_mission_id_fk
        foreign key (mission_id) references mission (mission_id),
    constraint user_mission_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table user_prefer
(
    user_prefer_id int auto_increment
        primary key,
    prefer_id      int         not null,
    user_id        int         not null,
    created_at     datetime(6) not null,
    updated_at     datetime(6) null,
    constraint user_prefer_prefer_prefer_id_fk
        foreign key (prefer_id) references prefer (prefer_id),
    constraint user_prefer_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

create table user_term
(
    user_term_id int auto_increment
        primary key,
    term_id      int         not null,
    user_id      int         not null,
    is_agreed    tinyint(1)  not null,
    date         datetime    not null,
    created_at   datetime(6) not null,
    updated_at   datetime(6) null,
    constraint user_term_term_term_id_fk
        foreign key (term_id) references term (term_id),
    constraint user_term_user_user_id_fk
        foreign key (user_id) references user (user_id)
);

