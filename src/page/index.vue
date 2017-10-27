<template>
    <div id="xiaozhi-wrapper">
        <div class="dialog-container page" :style="{display: !selfTest && !selfInfoShow ? 'block' : 'none'}">
            <img class="guide-img" data-index="0" src="../resource/image/step1.png" />
            <img class="guide-img hide" data-index="1" src="../resource/image/step2.png" />
            <img class="guide-img hide" data-index="2" src="../resource/image/step3.png" /> 
            <img class="guide-img hide" data-index="3" src="../resource/image/step4.png" />
            <div class="guide-mask"></div>
            <div class="white-mask"></div>
            <div class="dialog-panel">
                <div class="audio-active hide">
                    <div class="guide-mask"></div>
                    <div class="audio-box">
                        <img src="../resource/image/audio.gif" />
                    </div>
                </div>
                <div :is="item.component" :userInfo="item.userInfo" v-for="item in dialogueComponents"></div>
            </div>
            <div class="dialog-footer">
                <div class="more-app-icon" @click="showMoreClick">
                    <span class="font-icon icon-plus"></span>
                </div>
                <div class="footer-right" v-if="isRadio">
                    <div class="speech-or-input-big" id="touchArea">
                        <span class="font-icon icon-mic2"></span>
                    </div>
                    <span class="font-icon icon-user user-account-icon" @click="userInfoClick"></span>
                </div>
                <div class="footer-right footer-right-input" v-else>
                    <div class="input-text-wrapper">
                        <input class="input-text" placeholder="请输入问题" v-model="questionInput" />
                    </div>
                    <div class="speech-or-input-small" @click="returnRadioClick">
                        <span class="font-icon icon-mic2"></span>
                    </div>
                    <a href="javascript:void(0);" class="send-btn" @click="sendBtnClick">发送</a>
                </div>
                <div class="more-app-container" v-if="showMore">
                    <div class="more-app-container-app" @click="photoClick">
                        <input class="more-app-container-app-input opacity"
                            type="file"
                            accept="image/*"
                            value="imageValue"
                            @change="imageUploader"/>
                        <div class="more-app-container-app-imgbox">
                            <span class="font-icon icon-camera"></span>
                        </div>
                        <p class="more-app-container-app-text">拍摄</p>
                    </div>
                    <div class="more-app-container-app">
                        <div class="more-app-container-app-imgbox"
                        @click="foodManageClick('今天吃什么')">
                            <span class="font-icon icon-food"></span>
                        </div>
                        <p class="more-app-container-app-text">饮食管理</p>
                    </div>
                    <div class="more-app-container-app">
                        <div class="more-app-container-app-imgbox"
                            @click="foodManageClick('今天做什么运动')">
                            <span class="font-icon icon-sport"></span>
                        </div>
                        <p class="more-app-container-app-text">运动管理</p>
                    </div>
                    <div class="more-app-container-app">
                        <input class="more-app-container-app-input opacity"
                            type="file"
                            accept="image/*"
                            value="reportValue"
                            @change="reportUploader"/>
                        <div class="more-app-container-app-imgbox">
                            <span class="font-icon icon-health"></span>
                        </div>
                        <p class="more-app-container-app-text">上传报告</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-container page selfInfo-page"
            :style="{display: selfTest ? 'block' : 'none'}">
            <div class="delete-button" id="delete-button">X</div>
            <iframe height="100%" width="100%" src="https://wj.qq.com/s/1605459/4db7" 
            frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="dialog-container page selfInfo-page"
            :style="{display: selfInfoShow ? 'block' : 'none'}">
            <div class="return-button" id="return-button"></div>
            <div id="selfInfo-test"></div>
            <img src="../resource/image/selfInfo.png" />
        </div>
    </div>
</template>
<script>
import { Toast, MessageBox} from 'mint-ui';
import {uploadImage, dataURItoBlob} from '../util.js';
import {defaultTip} from '../config.js';
import {audioHandler} from '../recorder.js';
export default {
    components: {
        userSpeakText: () => import('../components/userSpeakText'),
        otherAnswerText: () => import('../components/otherAnswerText')
    },
    data() {
        return {
            isRadio: true,
            questionInput: '',
            showMore: false,
            imageValue: '',
            reportValue: '',
            selfTest: false,
            selfInfoShow: false,
            dialogueComponents: [
                {
                    component: 'otherAnswerText',
                    userInfo: {
                        content: 'hi～您好，我是您的专属AI健康小助手小智，借助百度的文字识别，图像识别，语音识别，大数据，百度百科和百度经验等给您提供全方位的健康服务。下面向您介绍我的使用方法哦：'
                            + '<br />'
                            + '【询问疾病】  糖尿病是什么？<br />'
                            + '【饮食管理】  今天吃什么？<br />'
                            + '【运动管理】  今天做什么运动？<br />'
                            + '随着小智的成长，会开放越来越多的功能哦',
                        avatar: '../resource/image/user.jpeg'
                    }
                }
            ]
        }
    },
    mounted: function () {
        setTimeout(function () {
            me.dialogueComponents.push({
                    component: 'otherAnswerText',
                    userInfo: {
                        content: '为了给您提供更好的服务，请填写以下问卷让小智更加了解您的健康状况：<br />'
                            + '<a href="javascript:void(0);" class="self-test">健康自测入口</a>',
                        avatar: '../resource/image/user.jpeg'
                    }
                });
        }, 3000);
        let timeOutEvent = 0;
        const me = this;
        let $parentEle = $('.dialog-footer');
        function __log(e, data) {
          console.log("\n" + e + " " + (data || ''));
        }
        let audio_context;
        try {
            navigator.getUserMedia = navigator.getUserMedia ||
                                       navigator.webkitGetUserMedia ||
                                       navigator.mozGetUserMedia ||
                                       navigator.msGetUserMedia;

            window.AudioContext = window.AudioContext ||
                                    window.webkitAudioContext;
            // webkit shim
            window.URL = window.URL || window.webkitURL;
            
            audio_context = new AudioContext();
            __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            Toast('No web audio support in this browser!');
        }
          
        navigator.getUserMedia({audio: true}, function(stream) {
            let audioInput = audio_context.createMediaStreamSource(stream);
            let audioData = audioHandler(audio_context);
            let recorder = audio_context.createScriptProcessor(4096, 1, 1);
            //音频采集
            recorder.onaudioprocess = function (e) {
                audioData.input(e.inputBuffer.getChannelData(0));
                //record(e.inputBuffer.getChannelData(0));
            }
            function uploadMedia() {
                recorder.disconnect();
                window.setTimeout(function() {
                    console.log('real stop');
                    let blob = audioData.encodeWAV();
                    console.log(blob);
                    var wavfile = new File([blob], "voice_8000.wav");
                    uploadImage('/xiaozhi/haha/?method=upload', {upload_file: wavfile})
                        .then(resp => {
                            audioData.clearInput();
                            if (!resp.status) {
                                // Toast('上传失败请重试！');
                                me.dialogueComponents.push({
                                    component: 'userSpeakText',
                                    userInfo: {
                                        content: resp.data_url
                                    }
                                });
                                me.dialogueComponents.push({
                                    component: 'otherAnswerText',
                                    userInfo: {
                                        content: defaultTip
                                    }
                                });
                            }
                            else {
                                me.dialogueComponents.push({
                                    component: 'userSpeakText',
                                    userInfo: {
                                        content: resp.data_url
                                    }
                                });
                                let html = resp.data && resp.data.output;
                                html += '<br />';
                                if (resp.data.wapCatalog && resp.data.wapCatalog.length) {
                                    html += resp.data.wapCatalog.join('');
                                }
                                me.dialogueComponents.push({
                                    component: 'otherAnswerText',
                                    userInfo: {
                                        content: html
                                    }
                                });
                            }
                        });
                }, 30)
            }
            $parentEle.on('touchstart', '#touchArea', function(e){
                timeOutEvent = setTimeout(function () {
                    timeOutEvent = 0;
                    // 长按事件触发
                    console.log('录音开始...');
                    $('.audio-active').removeClass('hide');
                    audioInput.connect(recorder);
                    recorder.connect(audio_context.destination);
                }, 500);
                e.preventDefault();  
            }).on('touchmove', function(){
                    clearTimeout(timeOutEvent);   
                    timeOutEvent = 0;
            }).on('touchend', '#touchArea', function(){  
                clearTimeout(timeOutEvent);
                if(timeOutEvent != 0){
                    me.isRadio = false;
                    me.showMore = false;
                } else {
                    uploadMedia();
                    console.log('录音结束，导出中...');
                    $('.audio-active').addClass('hide');
                }
                return false;   
            });
        }, function(e) {
            Toast('无法使用您的语音');
        });

        $('#xiaozhi-wrapper')
            .on('click', '.self-test', function(e) {
                me.selfTest = true;
                e.preventDefault();
            })
            .on('click', '#return-button', function (e) {
                me.selfInfoShow = false;
                e.preventDefault();
            })
            .on('click', '#selfInfo-test', function (e) {
                me.selfInfoShow = false;
                me.selfTest = true;
                e.preventDefault();
            });
        $('#delete-button').click(function(e) {
            me.selfTest = false;
            e.preventDefault();
            if (localStorage.getItem('xiaozhi')) {
                return;
            }
            localStorage.setItem('xiaozhi', 'lalala');
            me.dialogueComponents.push({
                component: 'otherAnswerText',
                userInfo: {
                    content: '小凡对你有了更多的了解哦，希望您能越来越健康。'
                }
            });
        });

        $('.guide-img').click(function (e) {
            let index = e.target.dataset && +e.target.dataset.index;
            if (index < 3) {
                $(this).addClass('hide');
                $('.guide-img').eq(index + 1).removeClass('hide');
            }
            else {
                $(this).addClass('hide');
                $('.guide-mask').addClass('hide');
                $('.white-mask').addClass('hide');
            }
        });
    },
    methods: {
        foodManageClick(text) {
            const me = this;
            $.get('/xiaozhi/haha/?method=language_rec', {
                content: text
            }, resp => {
                me.showMore = false;
                me.addDialogueComponents('userSpeakText', {
                    userInfo: {
                        content: text,
                        avatar: '../resource/image/user.jpeg'
                    }
                });
                me.questionInput = '';
                let html;
                if (resp.status) {
                    html = resp.data.output + '<br />';
                    if (resp.data.wapCatalog && resp.data.wapCatalog.length) {
                        html += resp.data.wapCatalog.join('');
                    }
                }
                me.addDialogueComponents('otherAnswerText', {
                    userInfo: {
                        content: html || defaultTip,
                        avatar: '../resource/image/xiaozhi.jpg'
                    }
                });
            });
        },
        userInfoClick() {
            this.selfInfoShow = true;
        },
        reportUploader(e) {
            this.reportValue = e.target.value;
            const me = this;
            const img = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = function(e){ // reader onload start  
                // 上传图片
                uploadImage('/xiaozhi/haha/?method=upload', {upload_file: dataURItoBlob(e.target.result)})
                    .then(resp => {
                        me.showMore = false;
                        if (!resp.status) {
                            Toast('上传失败请重试！');
                        }
                        me.reportValue = '';
                        const data = resp.data;
                        me.addDialogueComponents('userSpeakText', {
                            userInfo: {
                                content: data,
                                avatar: '../resource/image/user.jpeg'
                            }
                        });
                        $.get('/?method=health_rec', {
                            path: data
                        }, res => {
                            let stringText = '';
                            res.data.forEach(item => {
                                stringText += item.join('<br />') + '<br />';
                            });
                            me.addDialogueComponents('otherAnswerText', {
                                userInfo: {
                                    content: stringText,
                                    avatar: '../resource/image/xiaozhi.jpg'
                                }
                            });
                        });
                    });
            }
        },
        imageUploader(e) {
            this.imageValue = e.target.value;
            const me = this;
            const img = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = function(e){ // reader onload start  
                // 上传图片
                uploadImage('/xiaozhi/haha/?method=upload', {upload_file: dataURItoBlob(e.target.result)})
                    .then(resp => {
                        me.showMore = false;
                        if (!resp.status) {
                            Toast('上传失败请重试！');
                        }
                        me.imageValue = '';
                        const data = resp.data;
                        me.addDialogueComponents('userSpeakText', {
                            userInfo: {
                                content: data,
                                avatar: '../resource/image/user.jpeg'
                            }
                        });
                        $.get('/?method=dish_rec', {
                            path: data
                        }, res => {
                            if (!res.status) {
                                me.addDialogueComponents('otherAnswerText', {
                                    userInfo: {
                                        content: '您好，这份食物小智不认识，不能给您计算卡路里了哦。',
                                        avatar: '../resource/image/xiaozhi.jpg'
                                    }
                                });
                            }
                            else {
                                let stringText = res.data.name + '中含有' + res.data.calorie
                                    + '大卡，已记入您的饮食记录，好吃也不要贪多哦！';
                                me.addDialogueComponents('otherAnswerText', {
                                    userInfo: {
                                        content: stringText,
                                        avatar: '../resource/image/xiaozhi.jpg'
                                    }
                                });
                            }
                        });
                    });
            }
        },
        addDialogueComponents(component, props) {
            this.dialogueComponents.push({
                component: component,
                ...props
            });
        },
        showMoreClick() {
            this.showMore = !this.showMore;
        },
        returnRadioClick() {
            this.isRadio = true;
        },
        sendBtnClick() {
            if ($.trim(this.questionInput) === '') {
                return;
            }
            const me = this;
            $.get('/xiaozhi/haha/?method=language_rec', {
                content: this.questionInput
            }, resp => {
                me.addDialogueComponents('userSpeakText', {
                    userInfo: {
                        content: me.questionInput,
                        avatar: '../resource/image/user.jpeg'
                    }
                });
                me.questionInput = '';
                let html;
                if (resp.status) {
                    html = resp.data.output + '<br />';
                    if (resp.data.wapCatalog && resp.data.wapCatalog.length) {
                        html += resp.data.wapCatalog.join('');
                    }
                }
                me.addDialogueComponents('otherAnswerText', {
                    userInfo: {
                        content: html || defaultTip,
                        avatar: '../resource/image/xiaozhi.jpg'
                    }
                });
            });
        },
        photoClick() {
            this.cameraSheetVisible = true;
        }
    }
}
</script>