<template>
    <div style="flex-direction: row;">
        <ButtonColumn>
            <IconButton class="button" :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller class="scroller" over-scroll="50px" over-fling="50px">
            <text class="title">许可证</text>
            <div class="wrapper">
                <text class="license">{{ license }}</text>
            </div>
        </scroller>
    </div>
</template>

<style lang="less" scoped>
@import '../../styles/common.less';
@import '../../styles/md-color.less';

.wrapper {
    align-items: center;
}

.license {
    width: 80%;
    color: @on-primary;
    font-size: 10vh;
}
</style>

<script>
import fs from 'fs';

import IconButton from '../../components/icon-button.vue';
import ButtonColumn from '../../components/button-column.vue';

export default {
    name: 'license',
    components: {
        ButtonColumn,
        IconButton,
    },
    data() {
        return {
            license: '',
        };
    },
    methods: {
        back() {
            this.$page.finish();
        },
        onShow() {
            const licensePath = `${$workspace}/assets/license.txt`;

            fs.readFile(licensePath)
                .then(data => {
                    this.license = data;
                })
                .catch(error => {
                    this.license = "读取许可证文件失败，请务必联系作者 adogecheems 。";
                });
        },
    },
}
</script>