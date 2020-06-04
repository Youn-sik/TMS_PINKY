import Header from '@/components/Header'
import Vue from 'vue';

function getResult (Component, propsData) {
    const Constructor = Vue.extend(Component)
    const vm = new Constructor({ propsData: propsData }).$mount()
    return vm.$el.textContent
}

function functionResult (Component, propsData) {
    const Constructor = Vue.extend(Component)
    const vm = new Constructor({ propsData: propsData }).$mount()
    vm.clickLogout()
    return vm.isLogin
}

describe('Header', () => {
    it('isLogin Prop이 false일때 Header에 로그인이 뜨는지 검사', () => {
        expect(getResult(Header,{
            isLogin : false
        })).toBe('로그인');
    })

    it('isLogin Prop이 true일때 Header에 로그아웃이 뜨는지 검사', () => {
        expect(getResult(Header,{
            isLogin : true
        })).toBe('로그아웃');
    })
  });