<template>
    <div>
        <div v-if="loading" style="justify-content: center; align-items: center; height: 100vh;">
            <text class="loading">正在准备运算模块...</text>
        </div>
        <scroller scroll-direction="horizontal" show-scrollbar="false" v-else class="display">
            <div class="buttons">
                <IconButton style="margin-right: 5vh;" :icon="require('../../assets/back.png?base64')" @click="back" />
                <IconButton :icon="require('../../assets/info.png?base64')" @click="openInfo" />
            </div>
            <div style="flex-direction: row;">
                <text :style="{ color: textColor }" class="display-text">{{ display }}</text>
                <div style="margin-right: 7vh;" ref="end" />
            </div>
        </scroller>
        <div class="keyboard">
            <div class="line"><Button v-for="key in keyMap.line1" :key="key.sign" :text="key.text" :expr="key.expr"
                    :color="key.color" @click="click" /></div>
            <div class="line"><Button v-for="key in keyMap.line2" :key="key.sign" :text="key.text" :expr="key.expr"
                    :color="key.color" @click="click" /></div>
            <div class="line">
                <Button v-for="key in keyMap.line3" :key="key.sign" :text="key.text" :expr="key.expr" :color="key.color"
                    @click="click" />
                <Button :style="{ flex: 2 }" text="=" :expr="emptyObject" :color="c.lg" @click="evaluate" />
            </div>
        </div>
    </div>
</template>

<script>
import Button from '../../components/button.vue';
import IconButton from '../../components/icon-button.vue';
import CalculatorCore from '../../utils/core.js';
import { c, defaultKeyMap, invKeyMap } from '../../utils/key-map.js';

const textColors = {
    normal: '#e3e3e3',
    suc: '#6dd58c',
    err: '#f2b8b5'
};

export default {
    name: 'index',
    components: {
        Button,
        IconButton,
    },
    data() {
        return {
            c,
            loading: true,
            emptyObject: {},
            textColor: textColors.normal,
            core: new CalculatorCore(),
            offset: 'none',
        };
    },
    computed: {
        keyMap() {
            let keyMap = this.core.isInv ? invKeyMap : defaultKeyMap;
            keyMap.line2[0].text = this.core.unit === 'rad' ? 'deg' : 'rad';
            return keyMap;
        },
        display() {
            return this.core.getDisplay();
        },
    },
    methods: {
        click(expr) {
            this.textColor = textColors.normal;
            this.core.input(expr);
            setTimeout(() => {
                this.$page.$dom.scrollToElement(this.$refs.end);
            }, 25);
        },
        evaluate() {
            if (this.core.evaluate()) {
                this.textColor = textColors.suc;
            } else {
                this.textColor = textColors.err;
            }
        },
        openInfo() {
            $falcon.navTo('info');
        },
        back() {
            this.$page.finish();
        },
        onShow() {
            setTimeout(() => {
                this.core.warmUp();
                this.loading = false;
            }, 100);
        }
    },
};

</script>

<style lang="less" scoped>
@import '../../styles/md-color.less';

.loading {
    font-size: 10vh;
    color: @on-primary;
}

.display {
    width: 100vw;
    height: 30vh;
    padding: 2.5vh 0 0 5vh;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
}

.buttons {
    flex-direction: row;
    margin-right: 5vh;
}

.keyboard {
    height: 70vh;
}

.line {
    flex: 1;
    flex-direction: row;
}

.display-text {
    font-size: 15vh;
    text-align: right;
    lines: 1;
}
</style>