<template>
    <div class="user-speak-text">
        <!-- 图片 -->
        <div class="user-speak-text-box"
            v-if="['png', 'jpeg', 'jpg', 'png', 'fvg'].indexOf(userInfo.content.match(/[^\.]\w*$/)[0]) !== -1">
            <img class="user-speak-text-box-img" :src="userInfo.content" />
            <div class="right-arrow">
                <div class="arrow-bg"></div>
            </div>
        </div>
        <div class="user-speak-text-box" v-else>
            <div>{{userInfo.content}}</div>
            <div class="right-arrow">
                <div class="arrow-bg"></div>
            </div>
        </div>
        <div class="user-speak-text-avatar">
            <img :src="userInfo.avatar" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['userInfo']
}
</script>