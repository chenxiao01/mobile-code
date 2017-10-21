<template>
    <div class="dialog-container page">
        <mt-header fixed title="小智"></mt-header>
        <div class="dialog-panel"></div>
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
                <div class="more-app-container-app" @onclick="photoClick">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-camera"></span>
                    </div>
                    <p class="more-app-container-text">拍摄</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-coffee"></span>
                    </div>
                    <p class="more-app-container-text">饮食管理</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-bicycle"></span>
                    </div>
                    <p class="more-app-container-text">运动管理</p>
                </div>
                <div class="more-app-container-app">
                    <div class="more-app-container-app-imgbox">
                        <span class="fa fa-stethoscope"></span>
                    </div>
                    <p class="more-app-container-text">上传报告</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isRadio: false,
            questionInput: '',
            showMore: true
        }
    },
    mounted: function () {
    },
    methods: {
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
            
        },
        photoClick() {
            
        }
    }
}
</script>