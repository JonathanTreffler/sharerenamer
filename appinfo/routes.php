<?php

return [
	'resources' => [
		'sharerenamer' => ['url' => '/sharerenamer']
	],
	'routes' => [
		['name' => 'rename#rename', 'url' => '/rename', 'verb' => 'POST']
	]
];
