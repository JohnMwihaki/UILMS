from django.urls import path
from modules.search.views import AdvancedSearchView

urlpatterns = [
    path("", AdvancedSearchView.as_view(), name="advanced-search"),
]
