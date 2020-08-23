var dom = document.getElementById("graph_container")
var myChart = echarts.init(dom)
var option = null
var ent_list = []
var nodes = []
var links = []

var categories = {
  "USED-FOR": 0,
  "FEATURE-OF": 1,
  "HYPONYM-OF": 2,
  "PART-OF": 3,
  "CONJUNCTION": 4,
  "COMPARE": 5,
  "EVALUATE-FOR": 6
}

var legends = ["USED-FOR",
  "FEATURE-OF",
  "HYPONYM-OF",
  "PART-OF",
  "CONJUNCTION",
  "COMPARE",
  "EVALUATE-FOR"
]

var categories_name = []
legends.forEach(function (rel) {
  categories_name.push({
    name: rel
  })
})

option = {
  title: {
    text: "computer science KG",
    top: "top",
    left: "left",
    textStyle: {
      color: '#f7f7f7'
    }
  },
  toolbox: {
    show: true,
    feature: {
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  backgroundColor: '#00000',
  legend: {
    data: legends,
    textStyle: {
      color: '#fff'
    },
    icon: 'circle',
    type: 'scroll',
    orient: 'vertical',
    left: 10,
    top: 20,
    bottom: 20,
    itemWidth: 10,
    itemHeight: 10
  },
  animationDuration: 1000,
  animationEasingUpdate: 'quinticInOut',
  series: [{
    name: '知识图谱',
    type: 'graph',
    layout: 'force',
    force: {
      //repulsion: [60, 100],
      repulsion: 500,
      gravity: 0.1,
      edgeLength: 100,
      layoutAnimation: true,
    },
    data: nodes,
    links: links,
    categories: categories_name,
    roam: true,
    label: {
      normal: {
        show: true,
        position: 'inside',
        formatter: '{b}',
        fontSize: 16,
        fontStyle: '600',
      }
    },
    lineStyle: {
      normal: {
        opacity: 0.9,
        width: 1.5,
        curveness: 0
      }
    },
  }]
}

function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}

function addNode(entity, rel) {
  if (isInArray(ent_list, entity)) {
    return
  } else {
    ent_list.push(entity)
  }
  nodes.push({
    x: null,
    y: null,
    "name": entity,
    "symbolSize": 50,
    "category": typeof (rel) == "undefined" ? "source" : categories[rel],
    "draggable": "true"
  })
}

function addLink(entity, rel) {
  links.push({
    "source": rel,
    "target": entity,
    value: 1000,
    lineStyle: {
      normal: {
        color: 'source'
      }
    }
  })
}

function dealTriplets(triplets) {
  nodes.push({
    x: null,
    y: null,
    "name": triplets[0]["source"],
    "symbolSize": 50,
    "draggable": "true",
    "itemStyle": {
      "color": "rgb(205,198,115)"
    }
  })
  for (var i = 0; i < triplets.length; i++) {
    addNode(triplets[i]["target"], triplets[i]["rela"])
    addNode(triplets[i]["rela"], triplets[i]["rela"])
    addLink(triplets[i]["source"], triplets[i]["rela"])
    addLink(triplets[i]["target"], triplets[i]["rela"])
  }
}

test_data = {
  "links": [{
      "source": "s1",
      "target": "e1",
      "rela": "USED-FOR"
    },
    {
      "source": "s1",
      "target": "e2",
      "rela": "USED-FOR"
    },
    {
      "source": "s1",
      "target": "e3",
      "rela": "FEATURE-OF"
    },
    {
      "source": "s1",
      "target": "e4",
      "rela": "EVALUATE-FOR"
    },
  ]
}

function initialization() {
  // console.log("Graph initialize")
  myChart.showLoading()
  dealTriplets(test_data["links"])
  //console.log(nodes)
  //console.log(links)
  myChart.hideLoading()
  myChart.setOption(option)
}

function refresh(data) {
  // console.log("Graph refresh")
  triplets = data["link"]

  if (triplets.length <= 0) {
    _raise_modal_error('未搜索到该关键词')
    console.error('Query Error.')
    return
  }

  myChart.showLoading()
  nodes.length = 0
  links.length = 0
  ent_list.length = 0
  dealTriplets(triplets)
  //console.log(nodes)
  //console.log(links)
  myChart.hideLoading()
  myChart.setOption(option)
}

$(function () {
  $('#source_texarea').bind('keypress', function (event) {
    if (event.keyCode == "13") {
      $('.query-button').trigger('click')
    }
  })

  _ajax_submit("BLEU", "graph")
})
