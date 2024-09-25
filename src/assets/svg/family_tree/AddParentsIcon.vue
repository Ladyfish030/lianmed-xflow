<template>
	<svg class="icon" :width="width" :height="height" viewBox="0 0 273 170" fill="none"
		xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<defs>
			<clipPath id="clip59_62">
				<rect id="画板 1" width="273.000000" height="170.000000" fill="white" fill-opacity="0" />
			</clipPath>
		</defs>
		<rect id="画板 1" width="273.000000" height="170.000000" fill="#FFFFFF" fill-opacity="0" />
		<g clip-path="url(#clip59_62)">
			<rect id="矩形 1" x="10.000000" y="8.000000" width="90.000000" height="90.000000" fill="none" />
			<rect id="矩形 1" x="19.000000" y="17.000000" width="72.000000" height="72.000000" :stroke="color"
				stroke-opacity="1.000000" stroke-width="18.000000" />
			<circle id="椭圆 1" cx="219.000000" cy="53.000000" r="45.000000" fill="none" />
			<circle id="椭圆 1" cx="219.000000" cy="53.000000" r="36.000000" :stroke="color" stroke-opacity="1.000000"
				stroke-width="18.000000" />
			<line id="直线 1" x1="100.000000" y1="56.000000" x2="174.000000" y2="56.000000" :stroke="color"
				stroke-opacity="1.000000" stroke-width="18.000000" />
			<line id="直线 2" x1="134.500000" y1="162.002350" x2="134.500000" y2="62.002350" :stroke="color"
				stroke-opacity="1.000000" stroke-width="18.000000" />
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