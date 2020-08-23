var max_length = 5000
var max_file_size = 8 * 1024 * 1024
var target_original_jpredictions

var type_task_index = 5
var type_method_index = 7
var type_metric_index = 11
var type_material_index = 13
var type_other_index = 17
var type_generic_index = 19
var type_overlap_index = 35
var type_none_index = 1

$(function () {
  // Initialization
  $('#source_texarea').val('')
  $('#target_texarea').html('')
  $('[data-toggle="tooltip"]').tooltip()

  // Textarea Discription
  $('#source_texarea').bind('input propertychange', function () {
    _undisplay_textarea_discription()
  })

  // Recognize Text
  $('.query-button').on('click', function () {
    var $text_src = $('#source_texarea')
    var text_src = $text_src.val()

    if (text_src.length <= 0) {
      _raise_modal_error('无有效输入！')
      console.error('No text or document available.')
      return
    }

    var query_type
    switch ($(this).attr('var')) {
      case 'entity_query_button':
        query_type = 'entity'
        break
      case 'graph_query_button':
        query_type = 'graph'
        break
      case 'relation_query_button':
        query_type = 'relation'
        break
      default:
        _raise_modal_error('未知错误，请重试')
        console.error('Query Error.')
        return
    }

    _ajax_submit(text_src, query_type)
  })

  // Upload document
  $('#upload_doc_button').on('click', function () {
    $('#upload_doc_input').trigger('click')
  })

  $('#upload_doc_input').on('change', function (e) {
    var file = e.target.files[0]

    if (file.size <= 0) {
      _raise_modal_error('文件无效，请另选一个！')
      console.error('No file available.')
      return
    }

    if (file.size > max_file_size) {
      _raise_modal_error('文件大于8MB，请另选一个！')
      console.error('File too large.')
      return
    }

    var file_name = file.name
    var file_type = (file_name.substring(file_name.lastIndexOf(".") + 1, file_name.length)).toLowerCase()
    switch (file_type) {
      case 'txt':
        _read_txt_from_upload(file)
        break
      case 'pdf':
        _read_pdf_from_upload(file)
        break
      case 'docx':
      case 'pptx':
        _read_docx_from_upload(file)
        break
      default:
        _raise_modal_error('文件格式错误！')
        console.error('File type error.')
        return
    }
  })

  // Export predictions
  $('#export_output_button').on('click', function () {
    if (target_original_jpredictions == null) {
      _raise_modal_error('没有预测可导出！')
      console.error('No prediction available.')
      return;
    }

    _export_jpredictions()
  })
})

// Ajax Submit
function _ajax_submit(source, query_type) {
  var query_keynote
  switch (query_type) {
    case 'entity':
    case 'relation':
      query_keynote = '识别'
      break
    case 'graph':
      query_keynote = '搜索'
      break
    default:
      _raise_modal_error('未知错误，请重试！')
      console.error('Query error.')
      return
  }
  _disable_submit_button(query_keynote)

  var query_url = './../' + query_type + '_query/'
  $.ajax({
    type: 'post',
    url: query_url,
    data: {
      'source': source,
      csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()
    },
    dataType: 'json',
    success: function (ret) {
      console.log(ret['jpredictions'])
      var jpredictions = ret['jpredictions']

      switch (query_type) {
        case 'entity':
          target_original_jpredictions = jpredictions
          target_texarea_text = _parse_entity_jpredictions(jpredictions)
          $('#target_texarea').html('')
          $('#target_texarea').html(target_texarea_text)
          break
        case 'relation':
          target_original_jpredictions = jpredictions
          target_texarea_text = _parse_relation_jpredictions(jpredictions)
          $('#target_texarea').html('')
          $('#target_texarea').html(target_texarea_text)
          break
        case 'graph':
          refresh(jpredictions)
          break
        default:
          _raise_modal_error('未知错误，请重试！')
          console.error('Query error.')
          return
      }

      _enable_submit_button(query_keynote)
    },
    error: function (ret) {
      console.log('error: ' + ret);
      _enable_submit_button(query_keynote)
    }
  })
}

// Read File
function _crop_txt_to_submit(text) {
  var substring = text.substring(0, max_length)
  $("#source_texarea").val(substring)
  _undisplay_textarea_discription()
  $('.query-button').trigger('click')
}

function _raise_error_when_upload() {
  _raise_modal_error('上传失败，请重试！')
  console.error('Upload error, try again.')
}

function _read_txt_from_upload(file) {
  console.log('haashsa')
  var reader = new FileReader()
  reader.onload = function () {
    var text = this.result
    _crop_txt_to_submit(text)
  }
  reader.onerror = function (e) {
    _raise_error_when_upload()
  }
  reader.readAsText(file)
}

function _read_pdf_from_upload(file) {
  var reader = new FileReader()
  reader.onload = function () {
    var typedarray = new Uint8Array(this.result)
    _get_pdf_text(typedarray).then(function (text) {
      _crop_txt_to_submit(text)
    }, function (e) {
      _raise_error_when_upload()
    })
  }
  reader.readAsArrayBuffer(file)
}

function _read_docx_from_upload(file) {
  var reader = new FileReader()
  reader.onload = function () {
    var zip = new PizZip(reader.result)
    var doc = new window.docxtemplater(zip)
    var text = doc.getFullText()
    _crop_txt_to_submit(text)
  }
  reader.onerror = function (e) {
    _raise_error_when_upload()
  }
  reader.readAsBinaryString(file)
}

// Button Status
function _disable_submit_button(keynote) {
  $('.query-button').html('\
      <span class="spinner-border spinner-border-sm mr-2" \
        role="status" aria-hidden="true">\
      </span>' + keynote + '中...').addClass('disabled')
  $("#upload_doc_button").attr('disabled', true)
}

function _enable_submit_button(keynote) {
  $('.query-button').html(keynote).removeClass('disabled');
  $("#upload_doc_button").attr('disabled', false)
}

// PDF Text
function _get_pdf_text(typedarray) {
  var pdf = PDFJS.getDocument(typedarray)
  return pdf.then(function (pdf) {
    var maxPages = pdf.pdfInfo.numPages
    var countPromises = []
    // collecting all page promises
    for (var j = 1; j <= maxPages; j++) {
      var page = pdf.getPage(j)
      countPromises.push(page.then(function (page) {
        var textContent = page.getTextContent()
        return textContent.then(function (text) {
          return text.items.map(function (s) {
            return s.str
          }).join('')
        });
      }));
    }
    // Wait for all pages and join text
    return Promise.all(countPromises).then(function (texts) {
      return texts.join('')
    })
  })
}

// Export Predictions
function _export_jpredictions() {
  var jexport = JSON.stringify(target_original_jpredictions)
  var blob = new Blob([jexport], {
    type: "text/plain;charset=utf-8"
  })
  var filename = 'Predictions of CS.NER ' + _generate_timestamp() + '.json'

  var url = window.URL || window.webkitURL
  link = url.createObjectURL(blob)
  var a = $("<a />")
  a.attr("download", filename)
  a.attr("href", link)
  $("body").append(a)
  a[0].click()
  $("body").remove(a)
}

function _generate_timestamp() {
  var curr_time = new Date().Format("yyyy-MM-dd hh_mm_ss")
  return curr_time
}

function _expand_digit(digit) {
  var digit_expanded
  if (digit >= 1 && digit <= 9) {
    digit_expanded = "0" + digit;
  }
  return digit_expanded
}

// Modal Error
function _raise_modal_error(error_info) {
  $('#error_happened_modal #modal_error_content').text(error_info)
  $('#error_happened_modal').modal()
}

// Textarea Discription
function _undisplay_textarea_discription() {
  var $text_src = $('#source_texarea')
  // var $text_dst = $('#target_texarea')
  var $text_curr = $('#textarea_statistic_current')
  var $text_src_place = $('#source_texarea_placeholder_text')
  var $text_dst_place = $('#target_texarea_placeholder_text')
  var text_src_length = $text_src.val().length
  // var text_dst_length = $text_dst.text().length
  var text_src_remain = parseInt(max_length - text_src_length)

  if (text_src_length > 0) {
    $text_src_place.css('display', 'none')
    $text_dst_place.css('display', 'none')
  } else {
    $text_src_place.css('display', 'block')
    $text_dst_place.css('display', 'block')
  }

  if (text_src_remain > 0) {
    $text_curr.html(text_src_length)
  } else {
    $text_curr.html(max_length)
    $text_src.val($text_src.val().substring(0, max_length))
  }
}

// Date
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// Progress
NProgress.configure({
  showSpinner: false
});

$(document).ajaxStart(function () {
  NProgress.start();
});

$(document).ajaxStop(function () {
  NProgress.done();
});