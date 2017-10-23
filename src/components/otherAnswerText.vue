<template>
    <div class="other-speak-text">
        <div class="other-speak-text-avatar">
            <img :src="userInfo.avatar" />
        </div>
        <!-- 图片 -->
        <div class="other-speak-text-box"
            v-if="['png', 'jpeg', 'jpg', 'png', 'fvg'].indexOf(userInfo.content.match(/[^\.]\w*$/)[0])">
            <img :src="userInfo.content" />
            <div class="left-arrow">
                <div class="arrow-bg"></div>
            </div>
        </div>
        <div class="other-speak-text-box" v-else>
            <img :src="userInfo.content" />
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