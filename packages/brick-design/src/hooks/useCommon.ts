import { LEGO_BRIDGE, PropsNodeType, useSelector } from 'brickd-core';
import { CommonPropsType, controlUpdate, HookState, stateSelector } from '../common/handleFuns';
import { useEffect, useMemo } from 'react';
import { handleSelectedStatus, selectedStatus } from '../common/events';
import get from 'lodash/get';

export function useCommon(allProps: CommonPropsType) {
    const {specialProps, specialProps: {key}} = allProps
    const {selectedInfo, hoverKey, componentConfigs} = useSelector<HookState>(stateSelector,
        (prevState, nextState) => controlUpdate(prevState, nextState, key))

    const {selectedKey,domTreeKeys:SelectedDomKeys} = selectedInfo || {};

    const {isHovered, isSelected} = selectedStatus(key, hoverKey, selectedKey);

    /**
     * 当组件跨容器拖拽嵌套时,触发
     */
    const {props, addPropsConfig, childNodes, componentName} = componentConfigs[key]||{}
    const {mirrorModalField, propsConfig,nodePropsConfig} = useMemo(() => get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName), []);

    useEffect(() => {

        if (isSelected) {
            handleSelectedStatus(null, false, specialProps);
        }
    }, []);

    useEffect(()=>{
        /**
         * 如果组件为选中状态那就更新selectedInfo
         */
        if(nodePropsConfig&&componentName){
            for(const prop of Object.keys(nodePropsConfig)){
                const {isRequired}=nodePropsConfig[prop]
                if(isRequired&&(childNodes as PropsNodeType)[prop].length===0){
                    handleSelectedStatus(null,false,specialProps,prop)
                    break
                }
            }
        }
    },[childNodes])


    return {
        props,
        addPropsConfig,
        childNodes,
        componentName,
        mirrorModalField,
        propsConfig,
        isHovered,
        isSelected,
        componentConfigs,
        SelectedDomKeys
    }
}