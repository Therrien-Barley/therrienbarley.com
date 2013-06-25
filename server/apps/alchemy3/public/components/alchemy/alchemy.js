define([
    'jquery',
    'underscore',
    'backbone',
    'jquery-masonry',
    'globals',
    'collections/fragments',
    'views/fragmentsview',
    'models/tumblrpost',
    'views/tumblrpostview',
    'models/insight',
    'views/insightview',
    'collections/insights',
    'views/insightsview',
    'models/inquiry',
    'views/inquirystreamview',
    'collections/inquiries',
    'views/inquiriesview',
    'views/inquiryview',
    'models/user',
    'collections/users',
    'views/usersview',
    'collections/elements',
    'views/elementsview'
],
function($, _, Backbone, masonry, GLOBAL, Fragments, FragmentsView, TumblrPost, TumblrPostView, Insight, InsightView, Insights, InsightsView, Inquiry, InquiryStreamView, Inquiries, InquiriesView, InquiryView, User, Users, UsersView, Elements, ElementsView) {

    
    var Alchemy = {

        data: {},//used to de-scope (to pass values between functions) and persist

        init: function(){
            console.log('alchemy.js::init()');
            var that = this;

            //populate the GLOBAL.USERS collection and GLOBAL.SELF model
            this.getUsers();
            this.getSelf();

            //@todo: later, do this with the insights collection (fetch at site load) and a new InsightsMenuView
            /*
            $.ajax({
                url: 'http://therrienbarley.com/insights/air/api/insight',
                type: 'GET',
                success:function(data){
                    console.log('alchmey init returned');

                    var $menu = $('<div id="insights-menu" class="insights-menu"><h6>Add to insight</h6></div>');
                    $menu.append('<div class="new-insight"></div>');
                    $menu.append('<ul class="insights-options"></ul>');

                    _.each(data, function(insight, index){
                        var insight_title = (insight.title.length > 30) ? insight.title.substr(0, 30) + '...' : insight.title;

                        $menu.find('.insights-options').append('<li id="insight-'+insight._id+'" class="insights-option">'+insight_title+'</li>');
                    });

                    $('body').append($menu);
                }
            })*/

        },

        showInsightsMenu: function(event){
            console.log('showInsightsMenu()');
            console.dir(this);

        },

        //renders a single tumblr post into the #overlay div
        getTumblrPost: function(id){
            var _this = this;
            _this.data.tumblr_post = new TumblrPost({ id: id });
            _this.data.tumblr_post.fetch({
                success: function(model, response, options){

                    _this.data.tumblr_post_view = new TumblrPostView({
                        model: model,
                        el: '#overlay'
                    });

                    if(_this.data.tumblr_post_view.render()){
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);

                        if($('#overlay').length > 0){
                            $('#overlaybg').css('opacity', 0.95);
                            $('#overlay-close').bind('click', function(){
                                _this.data.tumblr_post_view.unrender();
                                _this.data.tumblr_post = null;
                                _this.data.tumblr_post_view = null;
                                $('html, body').animate({
                                    scrollTop: 0
                                }, 500);
                            });
                        }
                    }
                }
            });

        },

        createInsight: function(){
            var insight = new Insight({
                title: "Insight title",
                tags: [
                    "tag"
                ],
                description: "Description"
            });

            var insight_view = new InsightView({
                model: insight,
                el: '#new-insights-el'
            });

            //run render synchronously
            if(typeof insight_view.render() != 'undefined' ){
                $('#new-insights-el .insight-container').addClass('edit-mode');
                $('#new-insights-el .insight-container .edit').removeClass('edit span2').addClass('save span1 pull-left').text('Save');
                $('#new-insights-el .insight-container .editable').attr('contenteditable', 'true');
            }
        },

        renderInsights: function(segment){
            if(segment){
                console.log('Alchemy.js::renderInsights('+ segment + ')');
                var insights = new Insights({
                    segment: segment
                });
                insights.fetch({
                    success: function(collection, response, options){
                        var insights_view = new InsightsView({
                            collection: collection,
                            el: '#insights-el',
                            _insightViewEl: '.insights-list-el'
                        });

                        insights_view.render();
                    }
                });
            }else{
                console.log('Alchemy.js::renderInsights()');
                var insights = new Insights();
                insights.fetch({
                    success: function(collection, response, options){
                        var insights_view = new InsightsView({
                            collection: collection,
                            el: '#insights-el',
                            _insightViewEl: '.insights-list-el'
                        });

                        insights_view.render();
                    }
                });
            }
                

        },


        renderInquiryContent: function(_id){
            console.log('Alchemy.js::renderCollectionContent()');
            var elements = new Elements();
            elements.fetch({
                data: $.param({ _id: _id}),
                success: function(collection){
                    var collection_view = new ElementsView({
                        collection: collection,
                        el: '#collection-el',
                        _elementViewEl: '.elements-list-el'
                    });

                    console.log('about to call render collection_view');
                    collection_view.render();
                }
            });
        },

        renderInquiries: function(){
            console.log('Alchemy.js::renderInquiries()');
            var inquiries = new Inquiries();
            inquiries.fetch({
                success: function(collection, response, options){
                    var inquiries_view = new InquiriesView({
                        collection: collection,
                        el: '#inquiries-el',
                        _inquiryViewEl: '.inquiries-list-el'
                    });

                    inquiries_view.render();
                }
            });

            $('#main .add').click(function(event){
                
                if(!$(this).hasClass('disabled')){
                    console.log('clicked add');
                    $(this).addClass('disabled');

                    var inquiry = new Inquiry();

                    var inquiry_view = new InquiryView({
                        model: inquiry,
                        el: '#new-inquiries-el'
                    });

                    if(typeof inquiry_view.render() !== 'undefined'){
                        $('#new-inquiries-el #inquiry-new').addClass('edit-mode new');
                        $('#new-inquiries-el #inquiry-new .editable').attr('contenteditable', 'true');
                    }
                }


            });
        },

        getSelf: function(){
            GLOBAL.SELF = new User({
                isSelf: true
            });

            console.log("SELF ROOT: "+ GLOBAL.SELF.urlRoot);
            GLOBAL.SELF.fetch({
                success: function(model){
                    console.log('*** SELF!');
                    console.dir(model);
                }
            });
        },

        getUsers: function(){
            GLOBAL.USERS = new Users();
            GLOBAL.USERS.fetch();
        },

        renderUsers: function(){
            //@todo: just use GLOBAL.users, but make sure it's fresh
            console.log('Alchemy.js::renderUsers()');
            var users = new Users();
            users.fetch({
                success: function(collection, response, options){
                    var users_view = new UsersView({
                        collection: collection,
                        el: '#users-el',
                        _userViewEl: '.users-list-el'
                    });

                    users_view.render();
                }
            });

            $('#main .add').click(function(event){
                
                if(!$(this).hasClass('disabled')){
                    console.log('clicked add');
                    $(this).addClass('disabled');

                    var user = new User();

                    var user_view = new UserView({
                        model: collection,
                        el: '#new-users-el'
                    });

                    if(typeof user_view.render() !== 'undefined'){
                        $('#new-users-el #user-new').addClass('edit-mode new');
                        $('#new-users-el #user-new .editable').attr('contenteditable', 'true');
                    }
                }


            });
        },

        initFeedNav: function(){
            $('#feed-nav .add').click(function(){
                
            });
        },


    };//end Alchemy

    return Alchemy;

});