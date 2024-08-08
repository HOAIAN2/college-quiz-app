<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Ifsnop\Mysqldump;
use Illuminate\Support\Facades\Cache;

class BackupDatabase extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'app:backup-database {--once-per-day}';

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
		$now = Carbon::now();

		$host = env('DB_HOST');
		$database = env('DB_DATABASE');
		$username = env('DB_USERNAME');
		$password = env('DB_PASSWORD');

		$backup_filename = "$database-$now->timestamp-dump.sql";

		if ($this->option('once-per-day') && $this->hasBackupToday($database)) return;

		$dump = new Mysqldump\Mysqldump("mysql:host=$host;dbname=$database", $username, $password);
		$dump->start(storage_path("app/backup/database/$backup_filename"));

		$this->removeOldBackupFiles($database, $backup_filename);
	}

	public function hasBackupToday(string $database)
	{
		$directory = storage_path('app/backup/database');
		$files = glob($directory . DIRECTORY_SEPARATOR . "$database*.sql");
		foreach ($files as $file) {
			$modify_date = Carbon::parse(filemtime($file));
			if ($modify_date->isToday()) return true;
		}
		return false;
	}

	public function removeOldBackupFiles(string $database, string $current_file)
	{
		$directory = storage_path('app/backup/database');
		$files = glob($directory . DIRECTORY_SEPARATOR . "$database*.sql");
		foreach ($files as $file) {
			if (basename($file) == $current_file) continue;
			File::delete($file);
		}
	}
}
