from django.urls import path

from . import views

urlpatterns = [
    path('', views.graph_page, name='index'),
    path('graph/', views.graph_page, name='graph'),
    path('entity/', views.entity_page, name='entity'),
    path('relation/', views.relation_page, name='relation'),
    path('graph_query/', views.graph_query, name='graph_query'),
    path('entity_query/', views.entity_query, name='entity_query'),
    path('relation_query/', views.relation_query, name='relation_query'),
]
