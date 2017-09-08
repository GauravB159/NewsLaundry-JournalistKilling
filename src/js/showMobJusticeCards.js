setTimeout(function(){
  $('.animate-number').each(function () {
    $(this).prop('Counter',0).animate({
      Counter: $(this).text()
    },{
      duration: 2000,
      easing: 'swing',
      step: function (now) {
        $(this).text(Math.ceil(now));
      }
    });
  }); 
},1000)

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status == 200) {
      callback(null, xhr.response);
    } else {
      callback(status);
    }
  };
  xhr.send();
};

getJSON('https://cdn.protograph.pykih.com/49a045aea2b71456f5d04f4a/index.json', function (err, data){
  if (err != null) {
    alert('Something went wrong: ' + err);
  } else {
    let start_date_split = (new Date (data[data.length - 1].date)).toDateString().split(" "),
        end_date_split = (new Date (data[0].date)).toDateString().split(" "),
        start_date = start_date_split[2] + " " + start_date_split[1] + " '" + start_date_split[3].slice(-2),
        end_date = end_date_split[2] + " " + end_date_split[1] + " '" + end_date_split[3].slice(-2);
        
      document.getElementById('animate-number').innerHTML = data.length;
      document.getElementById('start-date').innerHTML = start_date;
      document.getElementById('end-date').innerHTML = end_date;
  }
})

getJSON('https://cdn.protograph.pykih.com/be0b3c8854f0b1e774b96580/index.json', function (err, data){
  if (err != null) {
    alert('Something went wrong: ' + err);
  } else {      
    let mob_cards = '';
    data.map((d,i) => {
      let img = d.screen_shot_url,
        new_date = d.date.split("-"),
        month = new Date(d.date).toLocaleDateString('en-US', {month: 'short'});
      mob_cards += '<div id="ProtoCard-'+ i +'" class="mob-justice-incidents" style="height:220px;overflow:hidden;">' +
        '<img src="'+img+ '" width="100%"/>'+
        '<div class="protograph-gradient">'+
          '<div class="data-card-content">'+
            '<div class="data-card-title">' + d.title + '</div>'+
            '<div class="data-card-date">' + new_date[2]+"th "+ month + " "+ new_date[0]+'</div>' +
            '</div>'+
          '</div>'+
        '</div>'
      document.getElementById('display-cards').innerHTML = mob_cards
    })
    let dimension = getScreenSize(), mode;
    if (dimension.width <= 400){
      mode = 'mobile';
    } else {
      mode = 'laptop';
    } 
    for (let i=0; i<data.length; i++) {
      let createDiv = document.createElement('div');
        createDiv.id = 'ProtoCard-'+i
      document.getElementById('ProtoCard-'+i).addEventListener('click', function (d) {
        $('.ui.modal').modal({
          onShow: function() {
            $("#proto-modal").css("height", 0)
          },
          onHide: function(){
            if (mode === 'laptop'){
              $("#proto-modal").css("height", "100%")
            }
          },
          onHidden: function(e) {
            let element = document.querySelector("#proto-embed-card iframe");
            element.parentNode.removeChild(element);
          }
        }).modal('attach events', '.close').modal('show')
        if (mode === 'laptop') {
          let pro = new ProtoEmbed.initFrame(document.getElementById("proto-embed-card"), data[i].iframe_url, 'laptop')
        } else {
          let pro = new ProtoEmbed.initFrame(document.getElementById("proto-embed-card"), data[i].iframe_url, 'mobile', true)
        } 
      })
    }
  }
})
// Articles section
getJSON('https://cdn.protograph.pykih.com/8dc5499c508b5b27951d9de1/index.json', function (err, data){
    if (err != null) {
      alert('Something went wrong: ' + err);
    } else {
      data.map((d,i) => {
        let createDiv = document.createElement('div');
        createDiv.id = 'ProtoCard-article'+i
        createDiv.className= 'ProtoCard-article'
        document.getElementById('display-stories').appendChild(createDiv)
        new ProtoEmbed.initFrame(document.getElementById("ProtoCard-article"+i), data[i].iframe_url, 'laptop')
      })
    }
})

//twitter chatter
getJSON('https://cdn.protograph.pykih.com/toReportViolence/twitter.json', function (err, data){
    if (err != null) {
      alert('Something went wrong: ' + err);
    } else {
      let tweets = '';
      data.map((d,i) => {       
        tweets += '<div style="margin-bottom:20px;padding:5px;"><a href="'+d.canonical+'" target="_blank" class="protograph-url">' +
          '<div style="margin-bottom:10px">'+
            '<img class="tolink-profile-image" src="'+d.author_image+'">'+
            '<div class="profile-title-div">'+
              '<div style="margin-bottom:0px">'+d.author+'</div>'+
              '<div class="tolink-light-text">@' +d.twitter_handle+'</div>'+
            '</div>'+
          '</div>'+         
          '<p>'+d.description+'</p>'+
        '</a></div>' 
      document.getElementById('display-tweets').innerHTML = tweets;   
      })
    }
  })

let interval = setInterval(function(){   
  getJSON('https://cdn.protograph.pykih.com/toReportViolence/twitter.json', function (err, data){
    if (err != null) {
      alert('Something went wrong: ' + err);
    } else {
      let tweets = '';
      data.map((d,i) => {       
        tweets += '<div style="margin-bottom:20px;padding:5px;"><a href="'+d.canonical+'" target="_blank" class="protograph-url">' +
          '<div style="margin-bottom:10px">'+
            '<img class="tolink-profile-image" src="'+d.author_image+'">'+
            '<div class="profile-title-div">'+
              '<div style="margin-bottom:0px">'+d.author+'</div>'+
              '<div class="tolink-light-text">@' +d.twitter_handle+'</div>'+
            '</div>'+
          '</div>'+         
          '<p>'+d.description+'</p>'+
        '</a></div>' 
      document.getElementById('display-tweets').innerHTML = tweets;   
      })
    }
  })
}, 60000)

function getScreenSize() {
  let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight|| e.clientHeight|| g.clientHeight;

  return {
    width: width,
    height: height
  };
}