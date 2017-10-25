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
        <div class="user-speak-text-box"
             v-else-if="userInfo.content.indexOf('.wav') !== -1">
             <audio :src="userInfo.content" controls="controls">
             您的浏览器不支持 audio 标签。
             </audio>
             <div class="left-arrow">
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
            <img src="../resource/image/user.svg" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['userInfo']
}
</script>