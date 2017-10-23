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
                <div class="speech-or-input-big" @click="speechClick">
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
export default {
    components: {
        userSpeakText: () => import('../components/userSpeakText'),
        otherAnswerText: () => import('../components/otherAnswerText')
    },
    data() {
        return {
            isRadio: false,
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
                        $.get('/xiaozhi/haha?method=health_rec', {
                            path: encodeURIComponent(data)
                        }, res => {
                            console.log(res);
                            me.addDialogueComponents('otherAnswerText', {
                                userInfo: {
                                    content: res.data,
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
        speechClick() {
            this.isRadio = false;
            this.showMore = false;
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