// Decorate Predictions
function _parse_relation_jpredictions(jpredictions) {
  console.log('Start Parsing')
  var target_texarea_text = ''

  $.each(jpredictions, function (index, doc) {
    var jtokens = doc['tokens']
    var jentities = doc['entities']
    var jrelations = doc['relations']

    $.each(jrelations, function (index, relation) {
      var rtype = relation['type']
      var rhead = relation['head']
      var rtail = relation['tail']

      var ehead = jentities[rhead]
      // var ehead_type = ehead['type']
      var ehead_start = ehead['start']
      var ehead_end = ehead['end']
      var ehead_token = ''

      for (let i = ehead_start; i < ehead_end; i++) {
        ehead_token += (i == ehead_start) ? '' : ' '
        ehead_token += jtokens[i]
      }

      var etail = jentities[rtail]
      // var etail_type = etail['type']
      var etail_start = etail['start']
      var etail_end = etail['end']
      var etail_token = ''

      for (let i = etail_start; i < etail_end; i++) {
        etail_token += (i == etail_start) ? '' : ' '
        etail_token += jtokens[i]
      }

      target_texarea_text += '<p>(HEAD: ' + ehead_token + ', TYPE: ' + rtype + ', TAIL: ' + etail_token + ')</p>'
    })
  })

  return target_texarea_text
}