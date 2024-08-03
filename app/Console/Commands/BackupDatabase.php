<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;
use Ifsnop\Mysqldump;
use Illuminate\Support\Facades\Cache;

class BackupDatabase extends Command
{
	const BACKUP_TIME_CACHE_KEY = 'last_backup_database_at';
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

		if ($this->option('once-per-day')) {
			$last_backup_database_at = Cache::has(self::BACKUP_TIME_CACHE_KEY)
				? Carbon::parse(Cache::get(self::BACKUP_TIME_CACHE_KEY))
				: $now;

			// $last_backup_database_at == $now mean Cache doesn't has self::BACKUP_TIME_CACHE_KEY
			if ($last_backup_database_at != $now && $last_backup_database_at->isToday()) {
				return;
			}
		}

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
		Cache::put(self::BACKUP_TIME_CACHE_KEY, $now->toDateTimeString());
	}
}
