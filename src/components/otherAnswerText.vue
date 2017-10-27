<template>
    <div class="other-speak-text">
        <div class="other-speak-text-avatar">
            <img src="../resource/image/xiaozhi.png" />
        </div>
        <div class="other-speak-text-box">
            <div v-html="userInfo.content">{{userInfo.content}}</div>
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