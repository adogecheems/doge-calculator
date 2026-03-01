<template>
    <div style="flex-direction: row;">
        <ButtonColumn>
            <IconButton :icon="require('../../assets/back.png?base64')" @click="back" />
        </ButtonColumn>
        <scroller class="scroller" show-scrollbar="false" over-scroll="50px" over-fling="50px">
            <text class="title">关于</text>
            <div class="wrapper">
                <div class="intro">
                    <image style="width: 40vh; height: 40vh;" :src="require('../../assets/app_icon.png?base64')" />
                    <text class="app-name">{{ appName }}</text>
                </div>
                <div class="description">
                    <text class="description-text">一款为有道词典笔OS设计的计算器程序</text>
                    <div style="flex-direction: row;">
                        <text class="description-text">基于</text>
                        <text @click="openLicense" class="link">AGPLv3</text>
                        <text class="description-text">许可证共享</text>
                    </div>
                </div>
                <div class="info-card" v-for="(value, item) in info" :key="item">
                    <text class="item-text">{{ item }}</text>
                    <text class="value-text">{{ value }}</text>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import ButtonColumn from '../../components/button-column.vue';
import IconButton from '../../components/icon-button.vue';
const meta = $falcon.$app.$meta

export default {
    name: 'info',
    components: {
        ButtonColumn,
        IconButton,
    },
    data() {
        return {
            appName: meta.name,
            info: {
                '作者': 'adogecheems',
                '版本': meta.version,
                '许可证': 'AGPLv3',
                'GitHub': 'https://github.com/adogecheems/doge-calculator',
                '程序路径': meta.appPath,
            },
        };
    },
    methods: {
        openLicense() {
            $falcon.navTo('license');
        },
        back() {
            this.$page.finish();
        }
    },
};
</script>

<style lang="less" scoped>
@import '../../styles/md-color.less';
@import '../../styles/common.less';

.wrapper {
    align-items: center;
}

.intro {
    margin-bottom: 15vh;
    flex-direction: row;
    align-items: center;
}

.description {
    margin-bottom: 15vh;
    align-items: center;
}

.description-text {
    color: @neutral;
    font-size: 10vh;
}

.app-name {
    margin-left: 10vh;
    color: @on-primary;
    font-size: 15vh;
    font-weight: bold;
}

.info-card {
    width: 80%;
    margin-bottom: 5vh;
    padding: 8vh 12vh;
    border-radius: 8vh;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: @primary;
}

.item-text {
    color: @on-primary;
    font-size: 12vh;
}

.value-text {
    text-align: right;
    max-width: 60%;
    color: @neutral;
    font-size: 10vh;
}
</style>
