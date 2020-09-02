from django.shortcuts import render
from django.http import JsonResponse

from .application.entity import entity
from .application.graph import graph
from .application.relation import relation


def index(request):
    return render(request, './index.html', {})


def graph_page(request):
    return render(request, './graph.html', {})


def entity_page(request):
    return render(request, './entity.html', {})


def relation_page(request):
    return render(request, './relation.html', {})


def graph_query(request):
    if request.is_ajax() and request.method == "POST":
        # Tokenize
        source = request.POST['source']
        jtoken = source

        # Query
        jpredictions = graph.graph_query(jtoken)

        return JsonResponse({'jpredictions': jpredictions})
    return render(request, './graph.html')


def entity_query(request):
    if request.is_ajax() and request.method == "POST":
        source = request.POST['source']

        # Query
        jpredictions = entity.entity_query(source)

        return JsonResponse({'jpredictions': jpredictions})
    return render(request, './entity.html')


def relation_query(request):
    if request.is_ajax() and request.method == "POST":
        source = request.POST['source']

        # Query
        jpredictions = relation.relation_query(source)

        return JsonResponse({'jpredictions': jpredictions})
    return render(request, './relation.html')


def int():
    entity.inst_entity()
    relation.inst_relation()


int()
