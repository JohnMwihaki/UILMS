from pathlib import Path
from datetime import timedelta
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================
# SECURITY
# ==========================

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", default=True, cast=bool)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    cast=lambda v: [host.strip() for host in v.split(",")]
)

# Automatically add Render external hostname if running on Render
if config("RENDER", default=False, cast=bool):
    RENDER_EXTERNAL_HOSTNAME = config("RENDER_EXTERNAL_HOSTNAME", default=None)
    if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# ==========================
# APPLICATIONS
# ==========================

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
]

LOCAL_APPS = [
    "modules.users",
    "modules.authentication",
    "modules.dashboard",
    "modules.organizations",
    "modules.academics",
    "modules.opportunities",
    "modules.documents",
    "modules.reports",
    "modules.notifications",
    "modules.search",
    "modules.settings_manager",
    "modules.common",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# ==========================
# MIDDLEWARE
# ==========================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

# ==========================
# TEMPLATES
# ==========================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ==========================
# DATABASE
# ==========================

import urllib.parse

DATABASE_URL = config("DATABASE_URL", default=None)

if DATABASE_URL:
    # Safely parse DATABASE_URL (handling unencoded '@' characters in password)
    scheme, rest = DATABASE_URL.split("://", 1)
    
    # Isolate database name from the right
    rest, db_name = rest.rsplit("/", 1)
    
    # Isolate credentials and host parameters from the right
    credentials, host_port = rest.rsplit("@", 1)
    
    # Isolate username and password
    user, password = credentials.split(":", 1)
    
    # Unquote url-encoded parts safely
    user = urllib.parse.unquote(user)
    password = urllib.parse.unquote(password)
    
    # Isolate host and port
    if ":" in host_port:
        host, port = host_port.rsplit(":", 1)
    else:
        host = host_port
        port = "5432"

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": db_name,
            "USER": user,
            "PASSWORD": password,
            "HOST": host,
            "PORT": port,
        }
    }
else:
    engine = config("DATABASE_ENGINE", default="django.db.backends.sqlite3")
    if "postgresql" in engine:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": config("POSTGRES_DB", default="university_industry_linkage"),
                "USER": config("POSTGRES_USER", default="postgres"),
                "PASSWORD": config("POSTGRES_PASSWORD", default=""),
                "HOST": config("POSTGRES_HOST", default="localhost"),
                "PORT": config("POSTGRES_PORT", default="5432"),
            }
        }
    else:
        DATABASES = {
            "default": {
                "ENGINE": engine,
                "NAME": BASE_DIR / config("DATABASE_NAME", default="db.sqlite3"),
            }
        }

# ==========================
# PASSWORD VALIDATION
# ==========================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ==========================
# CUSTOM USER
# ==========================

AUTH_USER_MODEL = "users.User"

# ==========================
# INTERNATIONALIZATION
# ==========================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Africa/Nairobi"

USE_I18N = True

USE_TZ = True

# ==========================
# STATIC FILES
# ==========================

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# ==========================
# MEDIA FILES
# ==========================

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ==========================
# DEFAULT PRIMARY KEY
# ==========================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==========================
# DJANGO REST FRAMEWORK
# ==========================

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),

    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),

    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
    ),

    "DEFAULT_RENDERER_CLASSES": (
        "modules.common.renderers.StandardizedJSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),

    "DEFAULT_SCHEMA_CLASS":
        "drf_spectacular.openapi.AutoSchema",

    "EXCEPTION_HANDLER":
        "modules.common.exceptions.custom_exception_handler",
}

# ==========================
# JWT
# ==========================

SIMPLE_JWT = {

    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=config(
            "ACCESS_TOKEN_LIFETIME",
            cast=int,
            default=60
        )
    ),

    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=config(
            "REFRESH_TOKEN_LIFETIME",
            cast=int,
            default=7
        )
    ),

    "ROTATE_REFRESH_TOKENS": True,

    "BLACKLIST_AFTER_ROTATION": True,
}

# ==========================
# CORS
# ==========================

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    cast=lambda v: [origin.strip() for origin in v.split(",")]
)

CORS_ALLOW_CREDENTIALS = True

# ==========================
# API DOCUMENTATION
# ==========================

SPECTACULAR_SETTINGS = {
    "TITLE": "University Industry Linkage API",
    "DESCRIPTION": "REST API for University Industry Linkage Management System",
    "VERSION": "1.0.0",
}