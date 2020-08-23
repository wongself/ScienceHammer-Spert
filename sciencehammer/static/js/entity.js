// Decorate Predictions
function _is_string_punctuation(s) {
  var punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
  return punctuation.includes(s)
}

function _parse_entity_jpredictions(jpredictions) {
  var target_texarea_text = ''

  $.each(jpredictions, function (index, doc) {
    var jtokens = doc['tokens']
    var jentities = doc['entities']
    var index_tokens_type = (new Array(jtokens.length)).fill(1)

    $.each(jentities, function (index, entity) {
      var etype = entity['type']
      var estart = entity['start']
      var eend = entity['end']
      for (let i = estart; i < eend; i++) {
        index_tokens_type[i] *= _get_type_index(etype)
      }
    })

    target_texarea_text += '<p><span>'

    $.each(jtokens, function (index, token) {
      var tokens_type_color = _get_type_color(index_tokens_type[index])
      var is_span = !index || index_tokens_type[index - 1] !== index_tokens_type[index]
      var is_before_overlap = index && (index_tokens_type[index] >= type_overlap_index && index_tokens_type[index - 1] < type_overlap_index)
      var is_after_overlap = !index || (index_tokens_type[index - 1] >= type_overlap_index && index_tokens_type[index] < type_overlap_index)
      var is_badge = (tokens_type_color !== 'etype-color-none') ? 'badge ' : ''

      target_texarea_text += (is_span && !is_before_overlap) ? '</span>' : ''
      target_texarea_text += (is_span && is_after_overlap) ? '<span class="' + is_badge + tokens_type_color + '">' : ''
      target_texarea_text += (_is_string_punctuation(token.substring(0, 1)) || !index) ? '' : ' '
      target_texarea_text += (is_span && is_before_overlap) ? '</span>' : ''
      target_texarea_text += (is_span && !is_after_overlap) ? '<span class="' + is_badge + tokens_type_color + '">' + token : token
    })

    target_texarea_text += '</span></p>'
  })

  return target_texarea_text
}

function _get_type_index(type) {
  switch (type) {
    case 'Task':
      return type_task_index
    case 'Method':
      return type_method_index
    case 'Metric':
      return type_metric_index
    case 'Material':
      return type_material_index
    case 'OtherScientificTerm':
      return type_other_index
    case 'Generic':
      return type_generic_index
    default:
      return type_none_index
  }
}

function _get_type_color(index) {
  var type_index_array = _decomposition_quality_factor(index)
  if (type_index_array.length === 0) {
    return 'etype-color-none'
  }

  var type_index_class = ''
  $.each(type_index_array, function (index, type) {
    if (index) {
      type_index_class += ' '
    }

    switch (type) {
      case type_task_index:
        type_index_class += 'etype-color-task'
        break;
      case type_method_index:
        type_index_class += 'etype-color-method'
        break;
      case type_metric_index:
        type_index_class += 'etype-color-metric'
        break;
      case type_material_index:
        type_index_class += 'etype-color-material'
        break;
      case type_other_index:
        type_index_class += 'etype-color-other'
        break;
      case type_generic_index:
        type_index_class += 'etype-color-generic'
        break;
      default:
        break;
    }
  })

  return type_index_class
}

function _decomposition_quality_factor(n) {
  var n_array = []
  for (var i = 5; i <= n; i++) {
    if (n % i == 0) {
      n_array.push(i)
      n = n / i
      i = 5
    }
  }
  return n_array
}
