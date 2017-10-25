<template>
    <div class="dialog-container page">
        <mt-header fixed title="小智"></mt-header>
        <div class="dialog-panel">
            <div :is="item.component" :userInfo="item.userInfo" v-for="item in dialogueComponents"></div>
        </div>
        <div class="dialog-footer">
            <div class="more-app-icon" @click="showMoreClick">
                <span class="fa fa-plus"></span>
            </div>
            <div class="footer-right" v-if="isRadio">
                <div class="speech-or-input-big" id="touchArea">
                    <span class="fa fa-microphone"></span>
                </div>
                <span class="fa fa-user-circle-o user-account-icon"></span>
            </div>
            <div class="footer-right footer-right-input" v-else>
                <div class="input-text-wrapper">
                    <input class="input-text" placeholder="请输入问题" v-model="questionInput" />
                </div>
                <div class="speech-or-input-small" @click="returnRadioClick">
                    <span class="fa fa-microphone"></span>
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
                        <span class="fa fa-camera"></span>
                    </div>
                    <p class="more-app-container-app-text">拍摄</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-coffee"></span>
                    </div>
                    <p class="more-app-container-app-text">饮食管理</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-bicycle"></span>
                    </div>
                    <p class="more-app-container-app-text">运动管理</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-stethoscope"></span>
                    </div>
                    <p class="more-app-container-app-text">上传报告</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
            dialogueComponents: [
                {
                    component: 'userSpeakText',
                    userInfo: {
                        content: '哈哈',
                        avatar: '../resource/image/user.jpeg'
                    }
                },
                {
                    component: 'otherAnswerText',
                    userInfo: {
                        content: '返回信息返回信息返回信息返回信息返回信息返回信息返回',
                        avatar: '../resource/image/user.jpeg'
                    }
                }
            ]
        }
    },
    mounted: function () {
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
            alert('No web audio support in this browser!');
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
                    let blob = audioData.encodeWAV();;
                    console.log(blob);
                    var wavfile = new File([blob], "voice_8000.wav");
                    uploadImage('/xiaozhi/haha?method=upload', {upload_file: wavfile})
                        .then(resp => {
                            if (!resp.status) {
                                Toast('上传失败请重试！');
                            }
                            me.dialogueComponents.push({
                                component: 'userSpeakText',
                                userInfo: {
                                    content: resp.data
                                }
                            });
                            $.get('/xiaozhi/haha/?method=voice_rec', {path: resp.data},
                                res => {
                                    console.log(res);
                                    me.dialogueComponents.push({
                                        component: 'otherAnswerText',
                                        userInfo: {
                                            content: res.data
                                        }
                                    });
                                });
                        })
                }, 30)
            }
            $parentEle.on('touchstart', '#touchArea', function(e){
                timeOutEvent = setTimeout(function () {
                    timeOutEvent = 0;
                    // 长按事件触发
                    console.log('录音开始...');
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
                }
                return false;   
            });
        }, function(e) {
            alert('无法使用您的语音');
        });


    },
    methods: {
        imageUploader(e) {
            this.imageValue = e.target.value;
            const me = this;
            const img = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = function(e){ // reader onload start  
                // 上传图片
                uploadImage('/xiaozhi/haha?method=upload', {upload_file: dataURItoBlob(e.target.result)})
                    .then(resp => {
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
                        $.get('/xiaozhi/haha?method=dish_rec', {
                            path: data
                        }, res => {
                            me.showMore = false;
                            let stringText = '菜品名称：' + res.data.name + '<br/>'
                                + '卡路里含量：' + res.data.calorie + '<br />'
                                + '置信度：' + res.data.probability;
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
            $.get('/xiaozhi/haha?method=language_rec', {
                content: this.questionInput
            }, resp => {
                me.addDialogueComponents('userSpeakText', {
                    userInfo: {
                        content: me.questionInput,
                        avatar: '../resource/image/user.jpeg'
                    }
                });
                me.questionInput = '';
                me.addDialogueComponents('otherAnswerText', {
                    userInfo: {
                        content: resp.data.abstract || defaultTip,
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