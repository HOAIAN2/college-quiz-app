<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Ifsnop\Mysqldump;

class BackupDatabase extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'app:backup-database';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Backup database to .sql';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$directory = storage_path('app/backup/database');
		if (!File::exists($directory)) {
			File::makeDirectory($directory, 0755, true);
		}
		$timestamp = Carbon::now()->timestamp;

		$host = config('database.connections.mysql.host');
		$username = config('database.connections.mysql.username');
		$database = config('database.connections.mysql.database');
		$password = config('database.connections.mysql.password');

		$backup_filename = "$database-$timestamp-dump.sql";

		$dump = new Mysqldump\Mysqldump("mysql:host=$host;dbname=$database", $username, $password);
		$dump->start(storage_path("app/backup/database/$backup_filename"));

		// Remove old backup

		$files = File::allFiles($directory);
		foreach ($files as $file) {
			if ($file->getFilename() === $backup_filename) {
				continue;
			}
			File::delete($file->getPathname());
		}
	}
}
