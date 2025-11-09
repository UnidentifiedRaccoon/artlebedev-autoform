<template>
  <div class="tooltip-wrapper" ref="wrapperRef">
    <div 
      @mouseenter="handleMouseEnter" 
      @mouseleave="showTooltip = false"
      class="tooltip-trigger"
    >
      <slot></slot>
    </div>
    <teleport to="body">
      <transition name="tooltip-fade">
        <div 
          v-if="showTooltip" 
          class="tooltip-content"
          :style="tooltipStyle"
        >
          {{ text }}
          <div class="tooltip-arrow" :class="`arrow-${position}`"></div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  text: string
  position?: Position
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top'
})

const showTooltip = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const tooltipPosition = ref({ top: 0, left: 0 })

const handleMouseEnter = (): void => {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect()
    const offset = 8
    
    switch (props.position) {
      case 'top':
        tooltipPosition.value = {
          top: rect.top - offset,
          left: rect.left + rect.width / 2
        }
        break
      case 'bottom':
        tooltipPosition.value = {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2
        }
        break
      case 'left':
        tooltipPosition.value = {
          top: rect.top + rect.height / 2,
          left: rect.left - offset
        }
        break
      case 'right':
        tooltipPosition.value = {
          top: rect.top + rect.height / 2,
          left: rect.right + offset
        }
        break
    }
  }
  showTooltip.value = true
}

const tooltipStyle = computed(() => {
  const style: Record<string, string | number> = {
    position: 'fixed',
    top: `${tooltipPosition.value.top}px`,
    left: `${tooltipPosition.value.left}px`,
    zIndex: 9999
  }

  if (props.position === 'top') {
    style.transform = 'translate(-50%, -100%)'
  } else if (props.position === 'bottom') {
    style.transform = 'translateX(-50%)'
  } else if (props.position === 'left') {
    style.transform = 'translate(-100%, -50%)'
  } else if (props.position === 'right') {
    style.transform = 'translateY(-50%)'
  }

  return style
})
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
}

.tooltip-trigger {
  display: inline-block;
}

.tooltip-content {
  padding: 8px 12px;
  background: #2c3e50;
  color: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.arrow-top {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-color: #2c3e50 transparent transparent transparent;
}

.arrow-bottom {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent #2c3e50 transparent;
}

.arrow-left {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent #2c3e50;
}

.arrow-right {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-color: transparent #2c3e50 transparent transparent;
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
}
</style>

