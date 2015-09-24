(function($){
	
    var FileUploader = function(options){
        this.$el = options.container;
    	this.url = options.url;
    	this.render = function(){
    		var that = this;
    		this.$el.append('<div class="ui grid">\
								  <div class="row">\
								    <div class="three wide column">\
								      <div id="attaching" class="ui teal fluid left labeled icon button">Attaching Files&nbsp;&nbsp;....<i class="attach icon"></i></div>\
								    </div>\
								    <div class="three wide column">\
								      <div id="upload" class="ui teal fluid left labeled icon button">Upload<i class="cloud upload icon"></i></div>\
								    </div>\
								  </div>\
								  <div class="row">\
								    <div class="six wide column">\
								      <form action="/upload" method="post" enctype="multipart/form-data"></form>\
								    </div>\
								  </div>\
                                  <div class="row">\
                                    <div class="three wide column">\
                                       <h4>File Name</h4>\
                                    </div>\
                                    <div class="right aligned three wide column">\
                                       <h4>Size</h4>\
                                    </div>\
                                  </div>\
                                  <div class="row" style="margin-top:-30px">\
                                    <div class="six wide column">\
                                        <div class="ui divider">\
                                        </div>\
                                    </div>\
                                  </div>\
								  <div class="row" style="margin-top:-30px">\
								    <div class="six wide column">\
								      <div class="ui divided list"></div>\
								    </div>\
								  </div>\
								  <div class="row">\
								    <div class="six wide column">\
								      <div id="progress" style="margin-top:20px;" data-percent="0" class="ui teal large progress">\
								        <div class="bar"></div>\
								        <div class="label">uploading files</div>\
								      </div>\
								    </div>\
								  </div>\
								</div>'
							);

            var form = this.$el.find('form');
            var attachingBtn = this.$el.find('#attaching');
            var uploadBtn = this.$el.find('#upload');
            var fileList = this.$el.find('.ui.list');
			var progressBar = this.$el.find('#progress');
			var progressBarLabel = this.$el.find('#progress .label');
            progressBar.hide();
			attachingBtn.on('click',function(event){
				form.append('<input type="file" multiple="multiple" name="files[]" style="display:none;">');
                var clickingInput = form.find('input:last');
                clickingInput.on('change', function () {

                    var itemTempalte = '<div class="item">\
										  <div class="content">\
										    <div class="ui grid">\
										      <div style="margin-top:10px;margin-bottom:10px;" class="ui two column row">\
										        <div class="column"><a>{{name}}</a></div>\
										        <div class="right aligned column"><a>{{size}}</a></div>\
										      </div>\
										    </div>\
										  </div>\
										</div>';
                    
                    var itemTemplateRender = Handlebars.compile(itemTempalte);
                    var fileNumber = this.files.length;
                    that.total += fileNumber;
                    for (var i = 0; i < fileNumber; i++) {
                        var dislay = {name: this.files[i].name, size: Math.round(this.files[i].size / 1000) + 'KB'};
                        fileList.append(itemTemplateRender(dislay));
                    }

                });
                clickingInput.click();
			});
            
            uploadBtn.on('click',function(event){
                progressBar.removeClass('error success');    
                progressBar.addClass('active');
                progressBar.progress({percent:0});
                progressBarLabel.text('uploading');
                progressBar.show();
                $(this).toggleClass("disabled");

                var uploadingCallback = function (e) {
	                if (e.lengthComputable) {
	                    var max = e.total;
	                    var current = e.loaded;
	                    var Percentage = Math.round((current * 100) / max); 
	                    progressBar.progress({percent:Percentage});
	                    progressBarLabel.text(''+ Percentage + ' % uploaded');              
	                }
                };

                var formData = new FormData(form[0]);
                $.ajax({
                    type: "POST",
                    url: that.url||'/upload',
                    data: formData,
                    processData: false,
                    contentType: false,
                    xhr: function () {
                        var uploadingxhr = $.ajaxSettings.xhr();
                        if (uploadingxhr.upload) {
                            uploadingxhr.upload.addEventListener('progress', uploadingCallback, false);
                        }
                        return uploadingxhr;
                    }                 
                }).always(function(data,textStatus,error){
                    progressBar.removeClass('active');
                    if(textStatus != 'success'){
                            progressBar.addClass('error');
                            progressBar.progress({percent:100});
                            progressBarLabel.text('upload failed');
        
                        }else{
                            progressBar.progress({percent:100,text:{success:'total ' + that.total + ' uploaded' }});
                        }
                        uploadBtn.removeClass('disabled');

                });            
            });

			
    	}
    };

	$.fn.fileUploader = function(options){
        var instance = new FileUploader({url:options.url,container:$(this)});
        instance.render();     
	};

})(jQuery);