<template>
    <div>
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
        <div class="md-modal-inner">
          <div class="md-top">
            <button class="md-close" @click="closeMd">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <slot name="message"></slot>
            </div>
            <div class="btn-wrap">
              <slot name="btnGroup" ></slot>
            </div>
          </div> 
        </div>
      </div>
      <div class="md-overlay"  v-show="mdShow" @click="closeMd"></div>
    </div>
</template>
<style>

</style>
<script>
    export default{
        props:['mdShow'],
        data(){
            return {

            }
        },
        methods:{
            closeMd(){
                console.log(1);
                this.$emit("closeMd");
            }
        }
    }
</script>
