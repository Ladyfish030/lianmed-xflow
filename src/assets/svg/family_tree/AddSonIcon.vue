<template>
    <svg class="icon" :width="width" :height="height" viewBox="0 0 273 170" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<defs>
		<clipPath id="clip59_85">
			<rect id="画板 1" width="273.000000" height="170.000000" fill="white" fill-opacity="0"/>
		</clipPath>
	</defs>
	<rect id="画板 1" width="273.000000" height="170.000000" fill="#FFFFFF" fill-opacity="0"/>
	<g clip-path="url(#clip59_85)">
		<rect id="矩形 1" x="91.000000" y="74.000000" width="90.000000" height="90.000000" fill="#FFFFFF" fill-opacity="0"/>
		<rect id="矩形 1" x="100.000000" y="83.000000" width="72.000000" height="72.000000" :stroke="color" stroke-opacity="1.000000" stroke-width="18.000000"/>
		<line id="直线 1" x1="136.000000" y1="74.000000" x2="136.000000" y2="4.000000" :stroke="color" stroke-opacity="1.000000" stroke-width="18.000000"/>
	</g>
</svg>
</template>

<script setup>
defineProps({
	color: {
		type: String,
		default: '#000000'
	},
	width: {
		type: String,
		default: '20px'
	},
	height: {
		type: String,
		default: '20px'
	}
})
</script>

<style scoped>
.icon {
    width: 20px;
    height: 20px;
}
</style>