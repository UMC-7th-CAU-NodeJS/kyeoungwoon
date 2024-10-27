-- 독립적인 테이블들 먼저 생성
CREATE TABLE umc.prefer
(
    prefer_id  int auto_increment PRIMARY KEY,
    name       varchar(30) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL
);

CREATE TABLE umc.area
(
    area_id    int auto_increment PRIMARY KEY,
    name       varchar(30) NOT NULL,
    address    varchar(100) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL
);

CREATE TABLE umc.store
(
    store_id   int auto_increment PRIMARY KEY,
    name       varchar(100) NOT NULL,
    address    varchar(100) NOT NULL,
    type       varchar(30) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL
);

CREATE TABLE umc.alarm_type
(
    alarm_type_id int auto_increment PRIMARY KEY,
    type          varchar(100) NOT NULL,
    created_at    DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at    DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL
);

CREATE TABLE umc.term
(
    term_id     int auto_increment PRIMARY KEY,
    title       varchar(100) NOT NULL,
    content     varchar(2048) NOT NULL,
    is_required tinyint(1) NOT NULL,
    created_at  DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at  DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL
);

CREATE TABLE umc.user
(
    user_id                  int auto_increment PRIMARY KEY,
    login_id                 varchar(30) NOT NULL,
    name                     varchar(30) NOT NULL,
    nickname                 varchar(30) NOT NULL,
    age                      int NOT NULL,
    gender                   varchar(30) NOT NULL,
    phone_number             varchar(30) NULL,
    is_phone_number_verified tinyint(1) NOT NULL,
    address                  varchar(100) NULL,
    email                    varchar(30) NULL,
    point                    int NULL,
    created_at               DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    inactive_at              DATETIME(6) NULL,
    terminated_at            DATETIME(6) NULL,
    CONSTRAINT user_pk UNIQUE (login_id)
);

-- user나 store, area를 참조하는 테이블들
CREATE TABLE umc.mission
(
    mission_id int auto_increment PRIMARY KEY,
    reward     int NOT NULL,
    name       varchar(30) NOT NULL,
    store_id   int NOT NULL,
    area_id    int NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT mission_area_area_id_fk FOREIGN KEY (area_id) REFERENCES umc.area (area_id),
    CONSTRAINT mission_store_store_id_fk FOREIGN KEY (store_id) REFERENCES umc.store (store_id)
);

CREATE TABLE umc.alarm
(
    alarm_id      int auto_increment PRIMARY KEY,
    user_id       int NOT NULL,
    alarm_type_id int NOT NULL,
    content       varchar(1024) NOT NULL,
    raised_at     DATETIME(6) NOT NULL,
    checked_at    DATETIME(6) NULL,
    created_at    DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at    DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT alarm_alarm_type_alarm_type_id_fk FOREIGN KEY (alarm_type_id) REFERENCES umc.alarm_type (alarm_type_id),
    CONSTRAINT alarm_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.personal_inquiry
(
    personal_inquiry_id int auto_increment PRIMARY KEY,
    user_id             int NOT NULL,
    title               varchar(100) NOT NULL,
    content             varchar(2048) NOT NULL,
    photo_url_1         varchar(200) NULL,
    photo_url_2         varchar(200) NULL,
    photo_url_3         varchar(200) NULL,
    status              int NOT NULL,
    raised_date         DATETIME(6) NOT NULL,
    closed_date         DATETIME(6) NULL,
    created_at          DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at          DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT personal_inquiry_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.point_log
(
    point_log_id int auto_increment PRIMARY KEY,
    user_id      int NOT NULL,
    point_change int NOT NULL,
    change_date  DATETIME(6) NOT NULL,
    created_at   DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at   DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT point_log_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.review
(
    review_id   int auto_increment PRIMARY KEY,
    content     varchar(100) NOT NULL,
    star        int NOT NULL,
    user_id     int NOT NULL,
    store_id    int NOT NULL,
    photo_url_1 varchar(200) NULL,
    photo_url_2 varchar(200) NULL,
    photo_url_3 varchar(200) NULL,
    created_at  DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at  DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT review_ibfk_1 FOREIGN KEY (user_id) REFERENCES umc.user (user_id),
    CONSTRAINT review_ibfk_2 FOREIGN KEY (store_id) REFERENCES umc.store (store_id)
);

CREATE TABLE umc.user_alarm_preference
(
    user_alarm_preference_id int auto_increment PRIMARY KEY,
    user_id                  int NOT NULL,
    alarm_type_id            int NOT NULL,
    status                   tinyint(1) NOT NULL,
    created_at               DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at               DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_alarm_preference_ibfk_1 FOREIGN KEY (alarm_type_id) REFERENCES umc.alarm_type (alarm_type_id),
    CONSTRAINT user_alarm_preference_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.user_area_count
(
    user_area_count_id int auto_increment PRIMARY KEY,
    user_id            int NOT NULL,
    area_id            int NOT NULL,
    count              int NULL,
    created_at         DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at         DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_area_count_ibfk_1 FOREIGN KEY (area_id) REFERENCES umc.area (area_id),
    CONSTRAINT user_area_count_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.user_mission
(
    user_mission_id int auto_increment PRIMARY KEY,
    user_id         int NOT NULL,
    mission_id      int NOT NULL,
    status          enum ('in_progress', 'success', 'fail') NOT NULL,
    started_at      DATETIME(6) NOT NULL,
    finished_at     DATETIME(6) NULL,
    created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_mission_mission_mission_id_fk FOREIGN KEY (mission_id) REFERENCES umc.mission (mission_id),
    CONSTRAINT user_mission_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.user_prefer
(
    user_prefer_id int auto_increment PRIMARY KEY,
    prefer_id      int NOT NULL,
    user_id        int NOT NULL,
    created_at     DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at     DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_prefer_prefer_prefer_id_fk FOREIGN KEY (prefer_id) REFERENCES umc.prefer (prefer_id),
    CONSTRAINT user_prefer_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.user_term
(
    user_term_id int auto_increment PRIMARY KEY,
    term_id      int NOT NULL,
    user_id      int NOT NULL,
    is_agreed    tinyint(1) NOT NULL,
    date         DATETIME NOT NULL,
    created_at   DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at   DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT user_term_term_term_id_fk FOREIGN KEY (term_id) REFERENCES umc.term (term_id),
    CONSTRAINT user_term_user_user_id_fk FOREIGN KEY (user_id) REFERENCES umc.user (user_id)
);

CREATE TABLE umc.area_mission
(
    area_mission_id int auto_increment PRIMARY KEY,
    area_id         int NOT NULL,
    mission_id      int NOT NULL,
    created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
    updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) NOT NULL,
    CONSTRAINT area_mission_area_area_id_fk FOREIGN KEY (area_id) REFERENCES umc.area (area_id),
    CONSTRAINT area_mission_mission_mission_id_fk FOREIGN KEY (mission_id) REFERENCES umc.mission (mission_id)
);