<template>
    <div class="other-speak-text">
        <div class="other-speak-text-avatar">
            <img src="../resource/image/xiaozhi.svg" />
        </div>
        <!-- 图片
        <div class="other-speak-text-box"
            v-if="/[^\.]\w*$/.test(userInfo.content)">
            <img :src="userInfo.content" />
            <div class="left-arrow">
                <div class="arrow-bg"></div>
            </div>
        </div>
         -->
        <div class="other-speak-text-box">
            <div>{{userInfo.content}}</div>
            <div class="left-arrow">
                <div class="arrow-bg"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['userInfo']
}
</script>