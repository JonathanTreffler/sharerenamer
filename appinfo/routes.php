<?php
return [
	'resources' => [
		'sharerenamer' => ['url' => '/sharerenamer']
	],
	'routes' => [
		['name' => 'sharerenamer#rename', 'url' => '/rename', 'verb' => 'POST']
	]
];
